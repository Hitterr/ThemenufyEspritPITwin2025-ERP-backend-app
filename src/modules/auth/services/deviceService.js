const superAdmin = require("../../../models/superAdmin");
const userService = require("../../user/services/userService");

class DeviceService {
  async removeDevices(userId, deviceIds) {
    const user = await userService.getUserById(userId);
    const superadmin = await superAdmin.findById(userId);
    if (!user && !superadmin) {
      throw new Error("User not found");
    }
    if (superadmin) {
      superadmin.verifiedDevices = superadmin.verifiedDevices.filter(
        (device) => !deviceIds.includes(device)
      );
      await superadmin.save();
      return superadmin.verifiedDevices;
    }

    user.verifiedDevices = user.verifiedDevices.filter(
      (device) => !deviceIds.includes(device)
    );
    await user.save();

    return user.verifiedDevices;
  }
  async checkDevice(userId, deviceId) {
    const user = await userService.getUserById(userId);
    const superAdmin = await superAdmin.findById(userId, { password: -1 });
    if (!user && !superAdmin) {
      throw new Error("User not found");
    }
    if (superAdmin) {
      return {
        isVerified: superAdmin.verifiedDevices.includes(deviceId),
        deviceId,
      };
    }
    return {
      isVerified: user.verifiedDevices.includes(deviceId),
      deviceId,
    };
  }
}

module.exports = new DeviceService();
