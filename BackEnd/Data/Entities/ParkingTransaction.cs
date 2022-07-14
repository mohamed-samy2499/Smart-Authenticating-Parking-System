using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Parking_System_API.Data.Entities
{
    public class ParkingTransaction
    {   [Key, Required, ForeignKey("FK_Participant_RelatedTo")]
        public string ParticipantId { get; set; }
        [Key, Required, ForeignKey("FK_Vehicle_RelatedTo")]
        public string PlateNumberId { get; set; }

        [Key, Required]
        public DateTime DateTimeTransaction { get; set; }
        [Required]
        public bool isEnter { get; set; } //0: Exit , 1: Enter


        public virtual Participant participant { get; set; }
        public virtual Vehicle vehicle { get; set; }

    }
}
