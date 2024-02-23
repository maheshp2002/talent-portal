using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.User;

public class ExamController : UserControllerBase
{
    private readonly ExamService _service;

    public ExamController(ExamService service)
    {
        _service = service;
    }

    [HttpGet("mcq-questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetExamQuestion([FromQuery] ExamDto dto)
    {
        var result = await _service.GetMcqQuestionsAsync(dto);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }

    [HttpGet("descriptive-questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetDescriptiveExamQuestion([FromQuery] ExamDto dto)
    {
        var result = await _service.GetDescriptiveQuestionsAsync(dto);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }

    [HttpPost("descriptive-answer")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PostDescriptiveAnswer(List<DescriptiveDto> dtos)
    {
        var result = await _service.CalculateSimilarityScore(dtos);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
