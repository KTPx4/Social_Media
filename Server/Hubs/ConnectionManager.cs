using System.Collections.Concurrent;

namespace Server.Hubs
{
    public class ConnectionManager
    {
        private readonly ConcurrentDictionary<string, string> _connectedUsers = new();

        public void AddConnection(string connectionId, string userId)
        {
            _connectedUsers[connectionId] = userId;
        }

        public void RemoveConnection(string connectionId)
        {
            _connectedUsers.TryRemove(connectionId, out _);
        }

        public List<string> GetConnections(List<Guid> userIds)
        {
            return _connectedUsers
                .Where(x => userIds.Contains(Guid.Parse(x.Value)))
                .Select(x => x.Key)
                .ToList();
        }
    }
}
