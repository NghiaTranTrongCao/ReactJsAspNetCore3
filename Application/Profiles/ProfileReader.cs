using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var targetUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);

            if (targetUser == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "User not found" });

            var profile = new Profile
            {
                DisplayName = targetUser.DisplayName,
                Username = targetUser.UserName,
                Image = targetUser.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = targetUser.Photos,
                Bio = targetUser.Bio,
                FollowersCount = targetUser.Followers.Count,
                FollowingCount = targetUser.Followings.Count
            };

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            if(currentUser.Followings.Any(x=>x.TargetId == targetUser.Id))
                profile.IsFollowed = true;

            return profile;
        }
    }
}