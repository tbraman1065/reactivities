using System;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest
    {
        public required Activity Activity { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper): IRequestHandler<Command>
    {
        private readonly IMapper _mapper = mapper;

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync(request.Activity.Id, cancellationToken) 
                           ?? throw new Exception("Activity not found");
            
                _mapper.Map(request.Activity, activity);

                await context.SaveChangesAsync(cancellationToken);
        }

    }
}
