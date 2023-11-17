using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.User
{
    [Route("api/detection")]
    [ApiController]
    public class DetectionController : ControllerBase
    {
        //private readonly IHubContext<SignalRHub> _hubContext;

        //public DetectionController(IHubContext<SignalRHub> hubContext)
        //{
        //    _hubContext = hubContext;
        //}

        //[HttpPost("start")]
        //public async Task<IActionResult> StartDetection()
        //{
        //    // Your existing code to start detection

        //    // When detection occurs, send the event to the connected clients via SignalR
        //    await _hubContext.Clients.All.SendAsync("ReceiveDetectionEvent", "Phone detected");

        //    return Ok("Detection started");
        //}

        //[HttpPost("stop")]
        //public IActionResult StopDetection()
        //{
        //    // Logic to stop detection

        //    return Ok("Detection stopped");
        //}
    }
}
