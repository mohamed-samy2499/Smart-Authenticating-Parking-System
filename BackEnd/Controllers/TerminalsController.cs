using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Parking_System_API.Data.DBContext;
using Parking_System_API.Data.Entities;
using Parking_System_API.Data.Repositories.CameraR;
using Parking_System_API.Data.Repositories.GateR;
using Parking_System_API.Data.Repositories.HardwareR;
using Parking_System_API.Data.Repositories.ParkingTransactionR;
using Parking_System_API.Data.Repositories.ParticipantR;
using Parking_System_API.Data.Repositories.VehicleR;
using Parking_System_API.Helper;
using Parking_System_API.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http;

namespace Parking_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerminalsController : ControllerBase
    {
        protected readonly IHubContext<MessageHub> _messageHub;
        private readonly AppDbContext context;
        private readonly IGateRepository gateRepository;
        private readonly ICameraRepository cameraRepository;
        private readonly ITerminalRepository terminalRepository;
        private readonly IParticipantRepository participantRepository;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IParkingTransactionRepository parkingTransactionRepository;
        private readonly IWebHostEnvironment webHostEnvironment;
        private static readonly HttpClient client1 = new HttpClient();
        public TerminalsController(IWebHostEnvironment webHostEnvironment, IHubContext<MessageHub> messageHub, IGateRepository gateRepository, ICameraRepository cameraRepository, ITerminalRepository terminalRepository, IParticipantRepository participantRepository, IVehicleRepository vehicleRepository, IParkingTransactionRepository parkingTransactionRepository)
        {
            this.gateRepository = gateRepository;
            this.cameraRepository = cameraRepository;
            this.terminalRepository = terminalRepository;
            this.participantRepository = participantRepository;
            this.vehicleRepository = vehicleRepository;
            this.parkingTransactionRepository = parkingTransactionRepository;
            _messageHub = messageHub;
            this.webHostEnvironment = webHostEnvironment;
        }



        [HttpPost("CarEntry/{GateId:int}")]
        public async Task<IActionResult> CarEntering(int GateId)
        {
            try
            {
                //Car Press Presence Sensor

                
                var gate = await gateRepository.GetGateById(GateId, true);

                if (gate == null)
                    return NotFound(new { Error = $"Gate with Id {GateId} is not found." });
                if (!gate.Service)
                {
                    return BadRequest(new { Error = "Gate is offline" });
                }
                if (gate.State) //gate is open
                {
                    gate.State = false;
                }
                //gate is closed
                //calling APNR model
                string PlateNum = "";
                await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model = "plate", status = "loading", terminate = false, message = "plate recognition system started" , imagePath = "" });
                Thread VehicleThread = new Thread(() => PlateNum = "ABC123"/*GetVehicleIdAsync("http://127.0.0.1:5000/start")*/);
                
                await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model="face", status = "loading" , terminate = false , message = "face recognition system started", imagePath = "" });

                //calling the faceModel

                List<string> ParticipantInfo = new List<string>();
                Thread ParticipantIdThread = new Thread(
                    () =>
                    ParticipantInfo = GetParticipantId("http://127.0.0.1:5000/"));
                ParticipantIdThread.Start();
                VehicleThread.Start();

                ParticipantIdThread.Join();
                VehicleThread.Join();
                var ParticipantId = ParticipantInfo[1];

                var face_path = ParticipantInfo[0];
                Image face_image = Image.FromFile(face_path);
                var i3 = new Bitmap(face_image);
                //send i2 to the frontend on sockets
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", "face.jpeg");
                i3.Save(filePath, ImageFormat.Jpeg);
                if (ParticipantId == "InternalError")
                {
                    await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model = "face", status = "failed", terminate = true, message = "recognition failed ", imagePath = "" });
                    return NotFound("face recognition failed");

                }
                    
                else if (ParticipantId == "unknown")
                    return NotFound(new { Error = "ParticipantId is unknown" });

                else if (ParticipantId == null)
                    return BadRequest(new { Error = "ParticipantId is null" });
                else 
                {
                    var filePath_plate = "https://localhost:44380/face_verify/face.jpeg";
                    await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model = "face", status = "success", 
                        terminate = false, message = $"face has been recognized with id :{ParticipantId}",
                        imagePath = filePath_plate
                    });
                    await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model = "plate", status = "success",
                        terminate = false, message = $"plate has been recognized with number :{PlateNum}", imagePath = ""
                    });
                    await _messageHub.Clients.All.SendAsync("sendToReact",
                    new SocketMessage() { model = "", status = "", terminate = true, message = "" });
                    Vehicle car = await vehicleRepository.GetVehicleAsyncByPlateNumber(PlateNum);

                Participant Person = await participantRepository.GetParticipantAsyncByID(ParticipantId, true);

                if (car == null)
                    return NotFound(new { Error = $"Car with PlateNumber {PlateNum} is not found" });


                //checking if Id exists in DB
                
                if (Person == null)
                    return NotFound(new { Error = $"Person with Id {ParticipantId} is not found." });


                if (Person.Vehicles.Contains(car))
                {
                    //check subscription
                    DateTime Timenow = DateTime.Now;
                    if (Timenow > car.StartSubscription && Timenow < car.EndSubscription)
                    {
                            //Parking Transaction
                        parkingTransactionRepository.Add(new ParkingTransaction() { ParticipantId = Person.Id, PlateNumberId = car.PlateNumberId, DateTimeTransaction = Timenow, isEnter = true });
                            if (!await parkingTransactionRepository.SaveChangesAsync())
                            {
                                return BadRequest("Enter Transaction is not completed");
                            }
                            gate.State = true;
                        return Ok("Access Allowed; Gate is being open");

                    }

                    else
                    {
                        return Unauthorized(new { Error = "Subscription is not valid." });
                    }

                }
                return NotFound(new { Error = $"Participant with {ParticipantId} doesn't own a Vehicle with PlateNumber {PlateNum}" });
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }

        }

        private static List<string> GetParticipantId(String Url)
        {
            try 
            {
            WebClient client = new WebClient();
            byte[] response = client.DownloadData(Url);
            string res = System.Text.Encoding.ASCII.GetString(response);
            JObject json = JObject.Parse(res);
            var face_path = json["face"].ToString();
            var id = json["Id"].ToString();
            var list =new List<string>(); 
            list.Add(face_path);
            list.Add(id);
            return list;

            }
            catch (Exception ex)
            {
                var list = new List<string>();
                list.Append(ex.Message);
                return list;
            }
        }
        private static  string GetVehicleIdAsync(String Url)
        {
            //var values = new Dictionary<string, string>
            //{
            //      { "address", "LP8_trimmed.mp4" }
            //};

            //var content = new FormUrlEncodedContent(values);

            //var response1 = await client1.PostAsync("http://127.0.0.1:5000/camfeed", content);

            //var responseString = await response1.Content.ReadAsStringAsync();
            WebClient client = new WebClient();
            byte[] response = client.DownloadData(Url);
            string res = System.Text.Encoding.ASCII.GetString(response);
            JObject json = JObject.Parse(res);

            byte[] bytes = Convert.FromBase64String(json["plate"].ToString());

            MemoryStream ms = new MemoryStream(bytes);
            Image ret = Image.FromStream(ms);
            var i2 = new Bitmap(ret);
            //send i2 to the frontend on sockets
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", "plate.jpeg");
            i2.Save(filePath, ImageFormat.Jpeg);
            return json["Id"].ToString();
        }

        [HttpPost("CarExit/{GateId:int}")]
        public async Task<IActionResult> CarExiting(int GateId)
        {
            try
            {
                //Car Press Presence Sensor

                var gate = await gateRepository.GetGateById(GateId, true);
                if (gate == null)
                    return NotFound(new { Error = $"Gate with Id {GateId} is not found." });
                if (!gate.Service)
                {
                    return BadRequest(new { Error = "Gate is offline" });
                }
                if (gate.State) //gate is open
                {
                    gate.State = false;
                }
                //gate is closed
                //calling APNR model

                string PlateNum = "";
                /*
                 * 
                 * 
                 */
                Thread VehicleThread = new Thread(() => PlateNum = "ABC123");



                //calling the faceModel

                List<string> ParticipantInfo = new List<string>();
                Thread ParticipantIdThread = new Thread(
                    () =>
                    ParticipantInfo = GetParticipantId("http://127.0.0.1:5000/"));
                ParticipantIdThread.Start();
                VehicleThread.Start();

                ParticipantIdThread.Join();
                VehicleThread.Join();


                var ParticipantId = ParticipantInfo[0];
                var face_path = ParticipantInfo[1];

                Vehicle car = null;
                Thread SearchCarThread = new Thread(
                    async () => car = await vehicleRepository.GetVehicleAsyncByPlateNumber(PlateNum));

                Participant Person = null;
                Thread SearchParticipantThread = new Thread(
                    async () => Person = await participantRepository.GetParticipantAsyncByID(ParticipantId, true)
                    );
                SearchCarThread.Start();
                SearchParticipantThread.Start();

                SearchCarThread.Join();
                SearchParticipantThread.Join();

                if (ParticipantId == null)
                    return BadRequest(new { Error = "ParticipantId is null" });
                if (ParticipantId == "unknown")
                //short term
                //user should move his head in front of camera for few seconds when detection starts
                
                {
                    var short_term_vehicle = new Vehicle { PlateNumberId = PlateNum };
                    ICollection<Vehicle> short_term_vehicles = new List<Vehicle>
                    {
                        short_term_vehicle
                    };

                    var short_term_participant = new ShortTerm 
                    {
                        Vehicle = short_term_vehicle ,
                        Id = Guid.NewGuid().ToString(),
                        DoProvideVideo = false,
                        DoDetected = false
                        
                    };
                    //Capture A few seconds video then upload it to face model to create the classifier for the current short term user
                    return NotFound(new { Error = "ParticipantId is unknown" });
                }

                //checking if Id exists in DB
                if (Person == null)
                    return NotFound(new { Error = $"Person with Id {ParticipantId} is not found." });

                //1- Driver is saved on car
                //2- Driver enter is the same as exit

                if (Person.Vehicles.Contains(car))
                {
                    //check subscription
                    DateTime Timenow = DateTime.Now;
                    if (Timenow > car.StartSubscription && Timenow < car.EndSubscription)
                    {
                        //Parking Transaction
                        parkingTransactionRepository.Add(new ParkingTransaction() { ParticipantId = Person.Id, PlateNumberId = car.PlateNumberId, DateTimeTransaction = Timenow, isEnter = false });
                        if (!await parkingTransactionRepository.SaveChangesAsync())
                        {
                            return BadRequest("Exit Transaction is not completed");
                        }
                        gate.State = true;
                        return Ok(new { Success = "Access Allowed; Gate is open" });

                    }
                    else
                    {
                        return Unauthorized(new { Error = "Subscription is not valid." });
                    }


                }else
                {
                    ParkingTransaction[] transaction = await parkingTransactionRepository.GetAllTransactionsForParticipantAndVehicle(ParticipantId, PlateNum) ;
                    if (transaction == null || transaction.Length == 0)
                    {
                        return Unauthorized(new { Error = "Not allowed to exit with car." });
                    }

                    else
                    {
                        var t = transaction[0];
                        if(t.isEnter) //Enter Direction - Casual
                        {
                            DateTime Timenow = DateTime.Now;
                            parkingTransactionRepository.Add(new ParkingTransaction() { ParticipantId = Person.Id, PlateNumberId = car.PlateNumberId, DateTimeTransaction = Timenow, isEnter = false });
                            if (!await parkingTransactionRepository.SaveChangesAsync())
                            {
                                return BadRequest("Exit Transaction is not completed");
                            }

                            var Duration = Timenow - t.DateTimeTransaction ;

                            //Calculate Duration and Amount of Money

                            return Ok(new { Success = "Access Allowed; Gate is open", Duration = $"{Duration}", Amount= $"{Duration * 2}" });
                        }

                        return Unauthorized(new { Error = $"no enter transaction with you and the car {PlateNum}." });
                    }
                }

               
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }



        [HttpPost("CarDeparture/{GateId:int}")]
        public async Task<IActionResult> CarDeparture(int GateId)
        {
            try
            {
                var gate = await gateRepository.GetGateById(GateId);
                if (gate == null)
                    return NotFound(new { Error = $"Gate with id {GateId} doesn't exit" });
                await Task.Delay(3000);
                gate.State = false;
                return Ok(new { Success = "Gate is closed" });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }
    }
}
