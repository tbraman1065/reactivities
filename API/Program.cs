using Application.Activities.Queries;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(opt => 
   {
        opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")); 
   });

builder.Services.AddCors();

// Map the MediatR handlers from the assembly containing GetActivityList.Handler
// This allows MediatR to discover and register all handlers in that assembly
// The RegisterServicesFromAssemblyContaining method scans the assembly for any classes that implement IRequestHandler or INotificationHandler
// This is necessary for the Mediator pattern to work, as it allows the application to send requests and receive responses through MediatR
// The GetActivityList.Handler class is used as a reference point to locate the assembly, but any handler in that assembly will be registered
builder.Services.AddMediatR(config => 
 config.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>());

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("http://localhost:3000", "https://localhost:3000"));

app.MapControllers();


// Seed the database with initial data
// Create a scope to get the required services
// Use CreateAsyncScope for async operations
using var scope = app.Services.CreateAsyncScope();
var services = scope.ServiceProvider;
try
{
    // Get the AppDbContext from the service provider without using dependency injection
    // Service locator pattern is used here to resolve the AppDbContext
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    //Service locator pattern is used here to resolve the ILogger<Program> for logging the error
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
