using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        // <summary>
        // The IMediator instance used to send requests and publish notifications.
        // </summary>
        private IMediator? _mediator;

        // <summary>
        // Gets the IMediator instance from the request services (program.cs).   
        // </summary>
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>() 
        ?? throw new InvalidOperationException("IMediator service is not registered.");

        
    }
}
