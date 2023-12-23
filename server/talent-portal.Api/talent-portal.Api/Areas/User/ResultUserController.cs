using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.user;

public class ResultUserController : UserControllerBase
{
    private readonly ResultService _service;

    public ResultUserController(ResultService service)
    {
        _service = service;
    }

    [HttpGet("result/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllResult(string userId)
    {
        var result = await _service.GetAllResultUserAsync(userId);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }

    [HttpGet("result")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCurrentResult([FromQuery] CurrentResultDto dto)
    {
        var result = await _service.GetCurrentResultAsync(dto);
        if (result.IsValid)
            return Ok(result.Result);

        return BadRequest(result.Errors);
    }

    [HttpPost("result")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddResult(ResultAddDto dto)
    {
        var result = await _service.ResultAddAsync(dto);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }


}
