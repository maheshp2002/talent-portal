using Microsoft.AspNetCore.Mvc;

namespace talent_portal.Api.Areas.Authentication
{
    [Area("account")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class AccountControllerBase : ControllerBase
    {
    }
}
