using Microsoft.AspNetCore.SignalR;
using Parking_System_API.Controllers;
using System.Threading.Tasks;

namespace Parking_System_API.Helper
{
    public class SocketMessages:Hub
    {
        TerminalsController tm = new TerminalsController(); 
        public async Task JoinRoom()
        {
            tm.CarEntering();
            //await Groups.AddToGroupAsync(Context.ConnectionId, "123");
            await Clients.All.SendAsync("reciveMessage", "Hey Everyone");

        }
    }
}
