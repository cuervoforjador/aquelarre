export default class newActor extends Actor {

  /**
   * getRollData
   * @override
   */
  getRollData() {
    
    return { ...this.toObject(false).system, ...{
        initiative: this.system.initiative ?? 0 }
    }
  }

  /**
   * rollInitiative
   * @override
   */
  async rollInitiative() {

    /**
    if (!game.combat) return null
    const combatant = game.combat.combatants.find(c => c.actorId === this.id)
    if (!combatant) return null
    const initiative = this.system.initiative ?? 0
    await combatant.update({ initiative })
    return combatant    
     */
  }  

}