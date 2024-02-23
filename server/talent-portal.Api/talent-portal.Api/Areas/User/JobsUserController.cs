using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.User;

public class JobsUserController : UserControllerBase
{
    private readonly JobsService _service;

    public JobsUserController(JobsService service)
    {
        _service = service;
    }

    [HttpGet("skill-jobs/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllJobs(string userId)
    {
        var result = await _service.GetAllJobsAsync(userId);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }

    [HttpGet("jobs/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllJobs(int id)
    {
        var result = await _service.GetJobAsync(id);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
