using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.Admin;

public class ResultAdminController : AdminControllerBase
{
    private readonly ResultService _service;

    public ResultAdminController (ResultService service)
    {
        _service = service;
    }

    [HttpGet("result")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllResult(int jobId)
    {
        var result = await _service.GetResultAdminAsync(jobId);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
