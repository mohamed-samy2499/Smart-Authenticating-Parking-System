using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Parking_System_API.Helper
{
    public class SocketMessages:Hub
    {
        public async Task JoinRoom()
        {
            //await Groups.AddToGroupAsync(Context.ConnectionId, "123");
            await Clients.All.SendAsync("reciveMessage", "Hey Everyone");
        }
    }
}
