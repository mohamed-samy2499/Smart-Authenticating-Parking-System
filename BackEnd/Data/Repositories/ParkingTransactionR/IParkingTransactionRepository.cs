using Parking_System_API.Data.Entities;
using System;
using System.Threading.Tasks;

namespace Parking_System_API.Data.Repositories.ParkingTransactionR
{
    public interface IParkingTransactionRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();

        // SystemUsers
        Task<ParkingTransaction[]> GetAllTransactions(bool getVehicles = false, bool getParticipants = false);
        Task<ParkingTransaction[]> GetAllTransactionsForParticipant(string ParticipantId, bool getVehicles = false);
        Task<ParkingTransaction[]> GetAllTransactionsForVehicle(string VehicleId, bool getParticipants = false);
        Task<ParkingTransaction[]> GetAllTransactionsForParticipantAndVehicle(string ParticipantId, string VehicleId);
        Task<ParkingTransaction> GetTransaction(DateTime dateTime, string participantId, string vehicleId);
        Task<ParkingTransaction[]> GetTransactionsByDateTime(DateTime dateTime, bool getVehicles = false, bool getParticipants = false);
        Task<ParkingTransaction[]> GetTransactionsByDateTimeRange(DateTime StartdateTime, DateTime EnddateTime, bool getVehicles = false, bool getParticipants = false);
    }
}
