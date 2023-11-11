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

    [HttpGet("skill-questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetExamQuestion(string skill)
    {
        var result = await _service.GetQuestionsAsync(skill);
        if (result.IsValid)
            return Ok(result);

        return BadRequest(result.Errors);
    }
}
