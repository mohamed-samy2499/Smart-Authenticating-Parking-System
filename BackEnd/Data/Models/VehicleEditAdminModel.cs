using System;

namespace Parking_System_API.Data.Models
{
    public class VehicleEditAdminModel
    {
        public string BrandName { get; set; }
        public string SubCategory { get; set; }

        public string Color { get; set; }

        public DateTime? StartSubscription { get; set; }

        public DateTime? EndSubscription { get; set; }
    }
}
