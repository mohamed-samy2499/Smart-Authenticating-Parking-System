using System;

namespace Parking_System_API.Data.Models
{
    public class ParkingTransactionAdminResponseModel
    {
        public string ParticipantId { get; set; }
        public string PlateNumberId { get; set; }
        public DateTime DateTimeTransaction { get; set; }

        public bool isEnter { get; set; } //0: Exit , 1: Enter
    }
}
