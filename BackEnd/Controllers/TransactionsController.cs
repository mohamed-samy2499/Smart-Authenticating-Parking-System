using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Parking_System_API.Data.Models;
using Parking_System_API.Data.Repositories.ParkingTransactionR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Parking_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly IParkingTransactionRepository _transactionRepository;
        private readonly IMapper _mapper;
        public TransactionsController(IParkingTransactionRepository parkingTransactionRepository, IMapper mapper)
        {
            _transactionRepository = parkingTransactionRepository;
            _mapper = mapper;
        }


        [HttpGet(), Authorize(Roles = "admin, operator")]
        public async Task<ActionResult<ParkingTransactionAdminResponseModel[]>> GetAllTransactions()
        {
            try
            {

                var transactions = await _transactionRepository.GetAllTransactions();
                if (transactions == null || transactions.Length == 0)
                {
                    return NotFound($"No transactions retrieved");
                }

                var model = _mapper.Map<ParkingTransactionAdminResponseModel[]>(transactions);

                return model;
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Error {ex}");
            }
        }


        [HttpGet("myTransactions"), Authorize(Roles = "participant")]
        public async Task<ActionResult<ParkingTransactionAdminResponseModel[]>> GetMyTransactions()
        {
            try
            {
                var id = User.Claims.First(i => i.Type == "ParticipantID").Value;
                var transactions = await _transactionRepository.GetAllTransactionsForParticipant(id);
                if (transactions == null || transactions.Length == 0)
                {
                    return NotFound($"No transactions for id {id} retrieved");
                }

                var model = _mapper.Map<ParkingTransactionAdminResponseModel[]>(transactions);

                return model;
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Error {ex}");
            }
        }

        [HttpGet("{plateID}"), Authorize(Roles = "admin, operator")]
        public async Task<ActionResult<ParkingTransactionAdminResponseModel[]>> GetVehicleTransactions(String plateID)
        {
            try
            {
                var transactions = await _transactionRepository.GetAllTransactionsForVehicle(plateID);
                if (transactions == null || transactions.Length == 0)
                {
                    return NotFound($"No transactions for plate number {plateID} retrieved");
                }

                var model = _mapper.Map<ParkingTransactionAdminResponseModel[]>(transactions);

                return model;
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Error {ex}");
            }
        }

        [HttpGet("meCar/{plateID}"), Authorize(Roles = "participant")]
        public async Task<ActionResult<ParkingTransactionAdminResponseModel[]>> GetMeMyVehicleTransactions(String plateID)
        {
            try
            {

                var id = User.Claims.First(i => i.Type == "ParticipantID").Value;
                var transactions = await _transactionRepository.GetAllTransactionsForParticipantAndVehicle(id, plateID);
                if (transactions == null || transactions.Length == 0)
                {
                    return NotFound($"No transactions for plate number {plateID} retrieved");
                }

                var model = _mapper.Map<ParkingTransactionAdminResponseModel[]>(transactions);

                return model;
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Error {ex}");
            }
        }
    }
}
