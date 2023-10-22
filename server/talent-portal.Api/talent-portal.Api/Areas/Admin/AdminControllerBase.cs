using Microsoft.AspNetCore.Mvc;

namespace talent_portal.Api.Areas.Authentication
{
    [Area("Admin")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class AdminControllerBase : ControllerBase
    {
    }
}
