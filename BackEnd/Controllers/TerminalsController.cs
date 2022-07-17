using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Parking_System_API.Data.DBContext;
using Parking_System_API.Data.Entities;
//using Parking_System_API.Data.Repositories.CameraR;
using Parking_System_API.Data.Repositories.GateR;
//using Parking_System_API.Data.Repositories.HardwareR;
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
using Parking_System_API.Data.Models;

namespace Parking_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerminalsController : ControllerBase
    {
        protected readonly IHubContext<MessageHub> _messageHub;
        private readonly AppDbContext context;
        private readonly IGateRepository gateRepository;
        //private readonly ICameraRepository cameraRepository;
        //private readonly ITerminalRepository terminalRepository;
        private readonly IParticipantRepository participantRepository;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IParkingTransactionRepository parkingTransactionRepository;
        private readonly IWebHostEnvironment webHostEnvironment;
        private static readonly HttpClient client1 = new HttpClient();
        public static string globalImgPlateName { get; set; } = "";
        public static string globalImgFaceName { get; set; } = "";

        public TerminalsController(IWebHostEnvironment webHostEnvironment, IHubContext<MessageHub> messageHub, IGateRepository gateRepository, IParticipantRepository participantRepository, IVehicleRepository vehicleRepository, IParkingTransactionRepository parkingTransactionRepository)
        {
            this.gateRepository = gateRepository;
            //this.cameraRepository = cameraRepository;
            //this.terminalRepository = terminalRepository;
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


                var gate = await gateRepository.GetGateById(GateId);

                if (gate == null)
                {
                    return NotFound(new { Error = $"Gate with Id {GateId} is not found." });
                }
                if (!gate.Service)
                {
                    return BadRequest(new { Error = "Gate is offline" });
                }
                if (gate.State) //gate is open
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"Gate was open  and being closed now",
                        imagePath = ""
                    });
                    gate.State = false;
                    if (!await gateRepository.SaveChangesAsync())
                    { 
                        
                    }

                    }
                await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"Gate is closed",
                        imagePath = ""
                    });
                //gate is closed
                //calling APNR model
                string PlateNum = "";
                await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage() { model = "plate", status = "loading", terminate = false, message = "plate recognition system started", imagePath = "" });
                Thread VehicleThread = new Thread(() => PlateNum = GetVehicleIdAsync("http://127.0.0.1:5000/start"));

                await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage() { model = "face", status = "loading", terminate = false, message = "face recognition system started", imagePath = "" });

                //calling the faceModel

                List<string> ParticipantInfo = new List<string>();
                Thread ParticipantIdThread = new Thread(
                    () =>
                    ParticipantInfo = GetParticipantId("http://127.0.0.1:8500/"));
                ParticipantIdThread.Start();
                VehicleThread.Start();

                ParticipantIdThread.Join();
                VehicleThread.Join();

                if (ParticipantInfo[0] == "face_failed")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "face", status = "failed", terminate = false, message = "recognition failed ", imagePath = "" });
                    if (PlateNum == "plate_failed") 
                    {
                            await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "plate",
                           status = "failed",
                           terminate = false,
                           message = $"recognition failed"
                        ,
                           imagePath = ""
                       });
                    }
                    else 
                    {
                            await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                      new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    }

                    return Ok(new { message = "face recognition or plate recognition failed" });
                }
                if (PlateNum == "plate_failed")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "plate", status = "failed", terminate = false, message = $"recognition failed"
                    , imagePath = "" });
                    if (ParticipantInfo[0] == "face_failed") 
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "face", status = "failed", terminate = false, message = "recognition failed ", imagePath = "" });
                    }
                    else 
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "face", status = "success", terminate = true, message = $"face has been recognized with ID :{ParticipantInfo[1]}", imagePath = "" });

                    }

                    return Ok(new { message = "face recognition or plate recognition failed" });
                }





                var ParticipantId = ParticipantInfo[1];

                //var face_path = ParticipantInfo[0];
                //Image face_image = Image.FromFile(face_path);
                //var i3 = new Bitmap(face_image);
                ////send i2 to the frontend on sockets
                //var imgName = $"face_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpeg";
                //globalImgFaceName = imgName;
                //var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", imgName);
                //i3.Save(filePath, ImageFormat.Jpeg);
                if (ParticipantId == "InternalError")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "face", status = "failed", terminate = false, message = "Internal server error ", imagePath = "" });


                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { message = "face recognition failed" });

                }

                else if (ParticipantId == "unknown")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"ParticipantId is unknown",
                           imagePath = ""
                       });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                 new SocketMessage()
                 {
                     model = "face",
                     status = "success",
                     terminate = false,
                     message = $"face has been recognized with id :{ ParticipantInfo[1]}"
                  ,
                     imagePath = ""
                 });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { Error = "ParticipantId is unknown" });
                }

                else if (ParticipantId == null) {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"ParticipantId is null",
                           imagePath = ""
                       });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage()
                   {
                       model = "face",
                       status = "failed",
                       terminate = false,
                       message = $"recognition failed"
                    ,
                       imagePath = ""
                   });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { Error = "ParticipantId is null" });
            }
                else
                {
                    var filePath_face = $"https://localhost:44380/face_verify//{globalImgFaceName}";
                    var filePath_plate = $"https://localhost:44380/face_verify//{globalImgPlateName}";
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage()
                    {
                        model = "face",
                        status = "success",
                        terminate = false,
                        message = $"face has been recognized with id :{ParticipantId}",
                        imagePath = filePath_face
                    });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage()
                    {
                        model = "plate",
                        status = "success",
                        terminate = false,
                        message = $"plate has been recognized with number :{PlateNum}",
                        imagePath = filePath_plate
                    });
                   
                    Vehicle car = await vehicleRepository.GetVehicleAsyncByPlateNumber(PlateNum);

                    Participant Person = await participantRepository.GetParticipantAsyncByID(ParticipantId, true);

                    if (car == null)
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Car with PlateNumber {PlateNum} is not found",
                           imagePath = ""
                       });
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "", status = "", terminate = true, message = "" });
                        return Ok(new { Error = $"Car with PlateNumber {PlateNum} is not found" });
                    }

                    if (car.IsPresent)
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Car {car.PlateNumberId} is already present",
                           imagePath = ""
                       });
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "", status = "", terminate = true, message = "" });
                        return Ok(new { Error = $"Car {car.PlateNumberId} is already present" });
                    }

                    //checking if Id exists in DB

                    if (Person == null)
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Person with Id {ParticipantId} is not found.",
                           imagePath = ""
                       });
                        return Ok(new { Error = $"Person with Id {ParticipantId} is not found." });
                    }

                    if (Person.Vehicles.Contains(car))
                    {
                        //check subscription
                        DateTime Timenow = DateTime.Now;
                        if (Timenow > car.StartSubscription && Timenow < car.EndSubscription)
                        {
                            //Parking Transaction
                            gate.State = true;
                            
                            await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                            new SocketMessage()
                            {
                                model = "gate",
                                status = "open",
                                terminate = false,
                                message = $"Enter is Allowed",
                                imagePath = ""
                            });
                            await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "", status = "", terminate = true, message = "" });

                            return Ok(new { message = "Access Allowed; Gate is being open", GateStatus = "${ gate.State}" });

                        }

                        else
                        {
                            await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                            new SocketMessage()
                            {
                                model = "gate",
                                status = "closed",
                                terminate = false,
                                message = $"Subscription is not valid.",
                                imagePath = ""
                            });
                            return NotFound(new { Error = "Subscription is not valid." });
                        }

                    }
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"This participant doesn't own the vehicle",
                        imagePath = ""
                    });
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
            byte[] bytes = Convert.FromBase64String(json["face"].ToString());

            MemoryStream ms = new MemoryStream(bytes);
            Image ret = Image.FromStream(ms);
            var i2 = new Bitmap(ret);
            //send i2 to the frontend on sockets
            var imgName = $"face_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpeg";
            globalImgFaceName = imgName;
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", imgName);
            i2.Save(filePath, ImageFormat.Jpeg);
            var face_path = "";
            var id = json["Id"].ToString();
            var list =new List<string>(); 
            list.Add(face_path);
            list.Add(id);
            return list;

            }
            catch (Exception ex)
            {
                var list = new List<string>();
                list.Add("face_failed");
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
            try
            {
                WebClient client = new WebClient();
                byte[] response = client.DownloadData(Url);
                string res = System.Text.Encoding.ASCII.GetString(response);
                JObject json = JObject.Parse(res);

                byte[] bytes = Convert.FromBase64String(json["plate"].ToString());

                MemoryStream ms = new MemoryStream(bytes);
                Image ret = Image.FromStream(ms);
                var i2 = new Bitmap(ret);
                //send i2 to the frontend on sockets
                var imgName = $"plate_{DateTime.Now.ToString("yyyyMMddHHmmssffff")}.jpeg";
                globalImgPlateName = imgName;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", imgName);
                i2.Save(filePath, ImageFormat.Jpeg);
                return json["Id"].ToString();
            }
            catch(Exception e)
            {
                return "plate_failed";
            }
        }

        [HttpPost("CarExit/{GateId:int}")]
        public async Task<IActionResult> CarExiting(int GateId)
        {
            try
            {
                //Car Press Presence Sensor

                var gate = await gateRepository.GetGateById(GateId);
                if (gate == null)
                    return NotFound(new { Error = $"Gate with Id {GateId} is not found." });
                if (!gate.Service)
                {
                    return BadRequest(new { Error = "Gate is offline" });
                }
                if (gate.State) //gate is open
                {
                    await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"Gate was open  and being closed now",
                        imagePath = ""
                    });
                    gate.State = false;
                    if (!await gateRepository.SaveChangesAsync())
                    {

                    }

                }
                await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"Gate is closed",
                        imagePath = ""
                    });
                //gate is closed
                //calling APNR model

                //string PlateNum = "";
                ///*
                // * 
                // * 
                // */
                //Thread VehicleThread = new Thread(() => PlateNum = "ABC123");



                ////calling the faceModel

                //List<string> ParticipantInfo = new List<string>();
                //Thread ParticipantIdThread = new Thread(
                //    () =>
                //    ParticipantInfo = GetParticipantId("http://127.0.0.1:5000/"));
                //ParticipantIdThread.Start();
                //VehicleThread.Start();

                //ParticipantIdThread.Join();
                //VehicleThread.Join();


                //var ParticipantId = ParticipantInfo[0];
                //var face_path = ParticipantInfo[1];

                //Vehicle car = null;
                //Thread SearchCarThread = new Thread(
                //    async () => car = await vehicleRepository.GetVehicleAsyncByPlateNumber(PlateNum));

                //Participant Person = null;
                //Thread SearchParticipantThread = new Thread(
                //    async () => Person = await participantRepository.GetParticipantAsyncByID(ParticipantId, true)
                //    );
                //SearchCarThread.Start();
                //SearchParticipantThread.Start();

                //SearchCarThread.Join();
                //SearchParticipantThread.Join();
                string PlateNum = "";
                await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage() { model = "plate", status = "loading", terminate = false, message = "plate recognition system started", imagePath = "" });
                Thread VehicleThread = new Thread(() => PlateNum = GetVehicleIdAsync("http://127.0.0.1:5000/start"));

                await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage() { model = "face", status = "loading", terminate = false, message = "face recognition system started", imagePath = "" });

                //calling the faceModel

                List<string> ParticipantInfo = new List<string>();
                Thread ParticipantIdThread = new Thread(
                    () =>
                    ParticipantInfo = GetParticipantId("http://127.0.0.1:8500/"));
                ParticipantIdThread.Start();
                VehicleThread.Start();

                ParticipantIdThread.Join();
                VehicleThread.Join();
                if (ParticipantInfo[0] == "face_failed")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "face", status = "failed", terminate = false, message = "recognition failed ", imagePath = "" });
                    if (PlateNum == "plate_failed")
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage()
                   {
                       model = "plate",
                       status = "failed",
                       terminate = false,
                       message = $"recognition failed"
                    ,
                       imagePath = ""
                   });
                    }
                    else
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    }

                    return Ok(new { message = "face recognition or plate recognition failed" });
                }
                if (PlateNum == "plate_failed")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage()
                   {
                       model = "plate",
                       status = "failed",
                       terminate = false,
                       message = $"recognition failed"
                    ,
                       imagePath = ""
                   });
                    if (ParticipantInfo[0] == "face_failed")
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "face", status = "failed", terminate = false, message = "recognition failed ", imagePath = "" });
                    }
                    else
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "face", status = "success", terminate = true, message = $"face has been recognized with ID :{ParticipantInfo[1]}", imagePath = "" });

                    }

                    return Ok(new { message = "face recognition or plate recognition failed" });
                }



                var ParticipantId = ParticipantInfo[1];

                //var face_path = ParticipantInfo[0];
                //Image face_image = Image.FromFile(face_path);
                //var i3 = new Bitmap(face_image);
                //send i2 to the frontend on sockets
                //var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\face_verify", "face.jpeg");
                //i3.Save(filePath, ImageFormat.Jpeg);
                if (ParticipantId == "InternalError")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage() { model = "face", status = "failed", terminate = false, message = "Internal server error ", imagePath = "" });


                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { message = "face recognition failed" });

                }

                else if (ParticipantId == "unknown")
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"ParticipantId is unknown",
                           imagePath = ""
                       });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                 new SocketMessage()
                 {
                     model = "face",
                     status = "success",
                     terminate = false,
                     message = $"face has been recognized with id :{ ParticipantInfo[1]}"
                  ,
                     imagePath = ""
                 });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { Error = "ParticipantId is unknown" });
                }

                else if (ParticipantId == null)
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"ParticipantId is null",
                           imagePath = ""
                       });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                   new SocketMessage()
                   {
                       model = "face",
                       status = "failed",
                       terminate = false,
                       message = $"recognition failed"
                    ,
                       imagePath = ""
                   });
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                  new SocketMessage() { model = "plate", status = "success", terminate = true, message = $"plate has been recognized with number :{PlateNum}", imagePath = "" });

                    return Ok(new { Error = "ParticipantId is null" });
                }
                else
                {
                    var filePath_face = $"https://localhost:44380/face_verify/{globalImgFaceName}";
                    var filePath_plate = $"https://localhost:44380/face_verify/{globalImgPlateName}";
                    await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage()
                    {
                        model = "face",
                        status = "success",
                        terminate = false,
                        message = $"face has been recognized with id :{ParticipantId}",
                        imagePath = filePath_face
                    });
                    await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage()
                    {
                        model = "plate",
                        status = "success",
                        terminate = false,
                        message = $"plate has been recognized with number :{PlateNum}",
                        imagePath = filePath_plate
                    });
                    
                    Vehicle car = await vehicleRepository.GetVehicleAsyncByPlateNumber(PlateNum);

                    Participant Person = await participantRepository.GetParticipantAsyncByID(ParticipantId, true);

                    if (car == null) {
                        await _messageHub.Clients.All.SendAsync("exitGateDetection",
                          new SocketMessage()
                          {
                              model = "gate",
                              status = "closed",
                              terminate = false,
                              message = $"Car with PlateNumber {PlateNum} is not found",
                              imagePath = ""
                          });
                        return Ok(new { Error = $"Car with PlateNumber {PlateNum} is not found" });
                    }
                    if (!car.IsPresent)
                    {
                        await _messageHub.Clients.All.SendAsync("exitGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Car {car.PlateNumberId} was not present in garage",
                           imagePath = ""
                       });
                        return Ok(new { Error = $"Car {car.PlateNumberId} was not present in garage" });
                    }

                    //checking if Id exists in DB

                    if (Person == null)
                    {
                        await _messageHub.Clients.All.SendAsync("exitGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Person with Id {ParticipantId} is not found.",
                           imagePath = ""
                       });
                        return Ok(new { Error = $"Person with Id {ParticipantId} is not found." });
                    }


                    if (Person.Vehicles.Contains(car))
                    {
                        //check subscription
                        DateTime Timenow = DateTime.Now;
                        if (Timenow > car.StartSubscription && Timenow < car.EndSubscription)
                        {
                            //Parking Transaction
                           

                            gate.State = true;
                      

                            await _messageHub.Clients.All.SendAsync("exitGateDetection",
                           new SocketMessage()
                           {
                               model = "gate",
                               status = "open",
                               terminate = false,
                               message = $"Allowed to Exit.",
                               imagePath = ""
                           });
                            await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage() { model = "", status = "", terminate = true, message = "" });
                            return Ok(new { message = "Exit is allowed", GateStatus = "${ gate.State}" });

                        }

                        else
                        {
                            await _messageHub.Clients.All.SendAsync("exitGateDetection",
                            new SocketMessage()
                            {
                                model = "gate",
                                status = "closed",
                                terminate = false,
                                message = $"Subscription is not valid.",
                                imagePath = ""
                            });
                            return NotFound(new { Error = "Subscription is not valid." });
                        }

                    }
                    await _messageHub.Clients.All.SendAsync("exitGateDetection",
                    new SocketMessage()
                    {
                        model = "gate",
                        status = "closed",
                        terminate = false,
                        message = $"This participant doesn't own the vehicle",
                        imagePath = ""
                    });
                    return NotFound(new { Error = $"Participant with {ParticipantId} doesn't own a Vehicle with PlateNumber {PlateNum}" });
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }



        [HttpPost("CarEntered/{gateId:int}")]
        public async Task<IActionResult> CarEntered(int gateId,[FromBody]carDeparture model)
        {
            try
            {
                string plateId = model.plateId;
                string faceId = model.faceId;

                var gate = await gateRepository.GetGateById(gateId);
                if (gate == null)
                    return NotFound(new { Error = $"Gate with id {gateId} doesn't exit" });
                
                
                if (!await gateRepository.SaveChangesAsync())
                {

                }
                Vehicle car = await vehicleRepository.GetVehicleAsyncByPlateNumber(plateId);

                Participant Person = await participantRepository.GetParticipantAsyncByID(faceId, true);
                if(gateId == 1) 
                {

                    parkingTransactionRepository.Add(new ParkingTransaction() { ParticipantId = faceId, PlateNumberId = plateId, DateTimeTransaction = DateTime.Now, isEnter = true });
                    car.IsPresent = true;
                    await Task.Delay(2000);
                    gate.State = false;
                    if (!await parkingTransactionRepository.SaveChangesAsync())
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Enter Transaction is not completed",
                           imagePath = ""
                       });


                        return Ok(new
                        {
                            Error = "Enter Transaction is not completed",
                            GateStatus = "${ gate.State}"
                        });
                    }
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                               new SocketMessage()
                               {
                                   model = "gate",
                                   status = "closed",
                                   terminate = false,
                                   message = $"Entrance transaction completed successfully",
                                   imagePath = ""
                               });
                    return Ok(new { Success = "Gate is closed", GateStatus = "${ gate.State}" });
                }
                if (gateId == 2)
                {

                    parkingTransactionRepository.Add(new ParkingTransaction() { ParticipantId = faceId, PlateNumberId = plateId, DateTimeTransaction = DateTime.Now, isEnter = false });
                    car.IsPresent = false;
                    await Task.Delay(2000);
                    gate.State = false;
                    if (!await parkingTransactionRepository.SaveChangesAsync())
                    {
                        await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                       new SocketMessage()
                       {
                           model = "gate",
                           status = "closed",
                           terminate = false,
                           message = $"Enter Transaction is not completed",
                           imagePath = ""
                       });


                        return Ok(new
                        {
                            Error = "Enter Transaction is not completed",
                            GateStatus = "${ gate.State}"
                        });
                    }
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                               new SocketMessage()
                               {
                                   model = "gate",
                                   status = "closed",
                                   terminate = false,
                                   message = $"exit transaction completed successfully",
                                   imagePath = ""
                               });
                    return Ok(new { Success = "Gate is closed", GateStatus = "${ gate.State}" });
                }
                else 
                {
                    await _messageHub.Clients.All.SendAsync("enteranceGateDetection",
                               new SocketMessage()
                               {
                                   model = "gate",
                                   status = "closed",
                                   terminate = false,
                                   message = $"transaction failed",
                                   imagePath = ""
                               });
                    return Ok(new { Success = "Gate is closed", GateStatus = "${ gate.State}" });
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
                gate.State = false;
                if (!await gateRepository.SaveChangesAsync())
                {

                }
                await _messageHub.Clients.All.SendAsync("exitGateDetection",
                           new SocketMessage()
                           {
                               model = "gate",
                               status = "closed",
                               terminate = false,
                               message = $"Gate is being closed the transaction failed",
                               imagePath = ""
                           });
                return Ok(new { Success = "transaction failed Gate is closed", GateStatus = "${ gate.State}" });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }

        [HttpPost("manualGateControl/{GateId:int}")]
        public async Task<IActionResult> GateControl(int GateId)
        {
            try
            {
                var gate = await gateRepository.GetGateById(GateId);
                if (gate == null)
                    return NotFound(new { Error = $"Gate with id {GateId} doesn't exit" });
                gate.State = !gate.State ;
                if (!await gateRepository.SaveChangesAsync())
                {
                    return Ok(new { Error = "Gate Not Closed" });
                }
                await _messageHub.Clients.All.SendAsync("exitGateDetection",
                           new SocketMessage()
                           {
                               model = "gate",
                               status = (gate.State)? "open": "closed",
                               terminate = false,
                               message = "",
                               imagePath = ""
                           });
                return Ok(new { GateStatus = "${gate.State}" });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }
        [HttpGet("gatesState")]
        public async Task<IActionResult> GateState()
        {
            try
            {
                var entranceGate = await gateRepository.GetGateById(1);
                var exitGate = await gateRepository.GetGateById(2);

                if (entranceGate == null)
                    return NotFound(new { Error = $"Gate with id {1} doesn't exit" });
                if (exitGate == null)
                    return NotFound(new { Error = $"Gate with id {2} doesn't exit" });

                return Ok(new { entranceGateStatus = "${entranceGate.State}" , exitGateStatus = "${exitGate.State}" });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Internal Server Error {ex}");
            }
        }

    }
}
