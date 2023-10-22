using Microsoft.AspNetCore.Mvc;

namespace talent_portal.Api.Areas.Authentication
{
    [Area("User")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class UserControllerBase : ControllerBase
    {
    }
}
