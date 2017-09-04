var roleBuilder = require("role.builder");
var roleHauler = require("role.hauler");
var roleMiner = require("role.miner");
var roleUpgrader = require("role.upgrader");

var _ = require("lodash");

var logger = require("util.logger");

module.exports = {
    run: function (room) {
        var spawn = this.getSpawnFromRoom(room);
        if(!spawn){
            return;
        }



        if (room.memory.minerSlots === undefined) {
            room.memory.minerSlots = roleMiner.getTotalSlots(room);
        }

        var desiredMiners = room.memory.minerSlots;
        var desiredHaulers = 2;
        var desiredUpgraders = 2;
        var desiredBuilders = 1;

        var counts = _.countBy(Game.creeps, _.property("memory.role"));

        const currentBuilders  = _.once(() => _.get(counts, "builder", 0));
        const currentHaulers   = _.once(() => _.get(counts, "hauler", 0));
        const currentMiners    = _.once(() => _.get(counts, "miner", 0));
        const currentUpgraders = _.once(() => _.get(counts, "upgrader", 0));

        // Make sure we don't just create a bunch of miners without haulers
        if (currentHaulers() === 0 && currentMiners() !== 0) {
            desiredMiners = 0;
        }

        room.memory.roles = counts;

        //Spawn more creeps if needed
        logger.debug('currentMiners=', currentMiners());
        logger.debug('miners=', desiredMiners > currentMiners());
        logger.debug('currentHaulers=', currentHaulers());
        logger.debug('haulers', desiredHaulers > currentHaulers());
        if (desiredMiners > currentMiners()){
            spawn.createCreep(roleMiner.design(room), undefined,                      {role: "miner", home: room.name});
        } else if (desiredHaulers > currentHaulers()){
            spawn.createCreep(roleHauler.design(room), undefined,                     {role: "hauler", home: room.name});
        } else if (desiredUpgraders > currentUpgraders()){
            spawn.createCreep(roleUpgrader.design(room), undefined,                   {role: "upgrader", home: room.name});
        } else if (desiredBuilders > currentBuilders()){
            spawn.createCreep(roleBuilder.design(room), undefined,                    {role: "builder", home: room.name});
        }
    },

    //Returns a vacant one (if any)
    getSpawnFromRoom: function(room){
        if(!room){
            return;
        }
        var spawns = room.find(FIND_MY_SPAWNS, {
            filter: function(spawn){
                return !spawn.spawning;
            }
        });
        return spawns[0];
    }
};