namespace Parking_System_API.Models
{
    public class SocketMessage
    {
        public string model { get; set; }
        public string status { get; set; }
        public bool terminate { get; set; }
        public string message { get; set; }

        public string imagePath { get; set; }


    }
}
