using AutoMapper;
using Parking_System_API.Data.Entities;
using Parking_System_API.Data.Models;
using System;

namespace Parking_System_API.Data.ProjectProfile
{
    public class TransactionProfile : Profile
    {
        public TransactionProfile()
        {
            this.CreateMap<ParkingTransaction, ParkingTransactionAdminResponseModel>();
        }
    }
}
