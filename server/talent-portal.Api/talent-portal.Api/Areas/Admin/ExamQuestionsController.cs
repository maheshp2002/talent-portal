using Microsoft.AspNetCore.Mvc;
using talent_portal.Api.Areas.Authentication;
using talent_portal.Service.Dto;
using talent_portal.Service.Services;

namespace talent_portal.Api.Areas.Admin;

public class ExamQuestionsController : AdminControllerBase
{
    private readonly ExamService _service;

    public ExamQuestionsController(ExamService service)
    {
        _service = service;
    }

    [HttpGet("questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAllExamQuestion()
    {
        var result = await _service.GetAllQuestionsAsync();
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }

    [HttpPost("questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PostExamQuestion(QuestionsAddDto dto)
    {
        var result = await _service.QuestionsAddAsync(dto);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
