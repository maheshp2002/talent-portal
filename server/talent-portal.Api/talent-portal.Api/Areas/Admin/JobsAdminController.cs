using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.Admin;

public class JobsAdminController : AdminControllerBase
{
    private readonly JobsService _service;

    public JobsAdminController(JobsService service)
    {
        _service = service;
    }

    [HttpGet("jobs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllJobs()
    {
        var result = await _service.GetAllJobsAsync();
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

    [HttpPost("jobs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PostExamQuestion(JobsAddDto dto)
    {
        var result = await _service.JobsAddAsync(dto);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
