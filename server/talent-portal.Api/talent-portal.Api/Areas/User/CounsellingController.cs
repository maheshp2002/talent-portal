using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.user;

public class CounsellingController : UserControllerBase
{
    private readonly CounsellingService _service;

    public CounsellingController(CounsellingService service)
    {
        _service = service;
    }

    [HttpGet("counselling")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAlCounselling()
    {
        var result = await _service.GetAllCounsellingAsync();
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
