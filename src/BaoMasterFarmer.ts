import {
  AddCall,
  Deposit,
  DevCall,
  EmergencyWithdraw,
  MassUpdatePoolsCall,
  BaoMasterFarmer as BaoMasterFarmerContract,
  MigrateCall,
  OwnershipTransferred,
  SetCall,
  SetMigratorCall,
  UpdatePoolCall,
  Withdraw,
} from '../generated/BaoMasterFarmer/BaoMasterFarmer'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  BAO_MASTER_FARMER_ADDRESS,
  BAO_MASTER_FARMER_START_BLOCK,
} from 'const'
import { History, BaoMasterFarmer, Pool, PoolHistory, User } from '../generated/schema'
import { getBaoPrice, getUSDRate } from 'pricing'

import { ERC20 as ERC20Contract } from '../generated/BaoMasterFarmer/ERC20'
import { Pair as PairContract } from '../generated/BaoMasterFarmer/Pair'

function getBaoMasterFarmer(block: ethereum.Block): BaoMasterFarmer {
  let baoMasterFarmer = BaoMasterFarmer.load(BAO_MASTER_FARMER_ADDRESS.toHex())

  if (baoMasterFarmer === null) {
    const contract = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)
    baoMasterFarmer = new BaoMasterFarmer(BAO_MASTER_FARMER_ADDRESS.toHex())
    baoMasterFarmer.bonusMultiplier = contract.REWARD_MULTIPLIER()
    baoMasterFarmer.bonusEndBlock = contract.FINISH_BONUS_AT_BLOCK()
    baoMasterFarmer.devaddr = contract.devaddr()
    baoMasterFarmer.migrator = contract.migrator()
    baoMasterFarmer.owner = contract.owner()
    // poolInfo ...
    baoMasterFarmer.startBlock = contract.START_BLOCK()
    baoMasterFarmer.bao = contract.Bao()
    baoMasterFarmer.baoPerBlock = contract.REWARD_PER_BLOCK()
    baoMasterFarmer.totalAllocPoint = contract.totalAllocPoint()
    // userInfo ...
    baoMasterFarmer.poolCount = BIG_INT_ZERO

    baoMasterFarmer.slpBalance = BIG_DECIMAL_ZERO
    baoMasterFarmer.slpAge = BIG_DECIMAL_ZERO
    baoMasterFarmer.slpAgeRemoved = BIG_DECIMAL_ZERO
    baoMasterFarmer.slpDeposited = BIG_DECIMAL_ZERO
    baoMasterFarmer.slpWithdrawn = BIG_DECIMAL_ZERO

    baoMasterFarmer.updatedAt = block.timestamp

    baoMasterFarmer.save()
  }

  return baoMasterFarmer as BaoMasterFarmer
}

export function getPool(id: BigInt, block: ethereum.Block): Pool {
  let pool = Pool.load(id.toString())

  if (pool === null) {
    const baoMasterFarmer = getBaoMasterFarmer(block)

    const baoMasterFarmerContract = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)
    const poolLength = baoMasterFarmerContract.poolLength()

    if (id >= poolLength) {
      return null
    }

    // Create new pool.
    pool = new Pool(id.toString())

    // Set relation
    pool.owner = baoMasterFarmer.id

    const poolInfo = baoMasterFarmerContract.poolInfo(baoMasterFarmer.poolCount)

    pool.pair = poolInfo.value0
    pool.allocPoint = poolInfo.value1
    pool.lastRewardBlock = poolInfo.value2
    pool.accBaoPerShare = poolInfo.value3

    // Total supply of LP tokens
    pool.balance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO

    pool.slpBalance = BIG_DECIMAL_ZERO
    pool.slpAge = BIG_DECIMAL_ZERO
    pool.slpAgeRemoved = BIG_DECIMAL_ZERO
    pool.slpDeposited = BIG_DECIMAL_ZERO
    pool.slpWithdrawn = BIG_DECIMAL_ZERO

    pool.timestamp = block.timestamp
    pool.block = block.number

    pool.updatedAt = block.timestamp
    pool.entryUSD = BIG_DECIMAL_ZERO
    pool.exitUSD = BIG_DECIMAL_ZERO
    pool.baoHarvested = BIG_DECIMAL_ZERO
    pool.baoHarvestedUSD = BIG_DECIMAL_ZERO
    pool.save()
  }

  return pool as Pool
}

function getHistory(owner: string, block: ethereum.Block): History {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = owner.concat(day.toString())

  let history = History.load(id)

  if (history === null) {
    history = new History(id)
    history.owner = owner
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
  }

  return history as History
}

function getPoolHistory(pool: Pool, block: ethereum.Block): PoolHistory {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = pool.id.concat(day.toString())

  let history = PoolHistory.load(id)

  if (history === null) {
    history = new PoolHistory(id)
    history.pool = pool.id
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
    history.entryUSD = BIG_DECIMAL_ZERO
    history.exitUSD = BIG_DECIMAL_ZERO
    history.baoHarvested = BIG_DECIMAL_ZERO
    history.baoHarvestedUSD = BIG_DECIMAL_ZERO
  }

  return history as PoolHistory
}

export function getUser(pid: BigInt, address: Address, block: ethereum.Block): User {
  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)

  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.pool = null
    user.address = address
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.baoHarvested = BIG_DECIMAL_ZERO
    user.baoHarvestedUSD = BIG_DECIMAL_ZERO
    user.entryUSD = BIG_DECIMAL_ZERO
    user.exitUSD = BIG_DECIMAL_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()
  }

  return user as User
}

export function add(event: AddCall): void {
  const baoMasterFarmer = getBaoMasterFarmer(event.block)

  log.info('Add pool #{}', [baoMasterFarmer.poolCount.toString()])

  const pool = getPool(baoMasterFarmer.poolCount, event.block)

  if (pool === null) {
    log.error('Pool added with id greater than poolLength, pool #{}', [baoMasterFarmer.poolCount.toString()])
    return
  }

  // Update BaoMasterFarmer.
  baoMasterFarmer.totalAllocPoint = baoMasterFarmer.totalAllocPoint.plus(pool.allocPoint)
  baoMasterFarmer.poolCount = baoMasterFarmer.poolCount.plus(BIG_INT_ONE)
  baoMasterFarmer.save()
}

// Calls
export function set(call: SetCall): void {
  log.info('Set pool id: {} allocPoint: {} withUpdate: {}', [
    call.inputs._pid.toString(),
    call.inputs._allocPoint.toString(),
    call.inputs._withUpdate ? 'true' : 'false',
  ])

  const pool = getPool(call.inputs._pid, call.block)

  const baoMasterFarmer = getBaoMasterFarmer(call.block)

  // Update masterchef
  baoMasterFarmer.totalAllocPoint = baoMasterFarmer.totalAllocPoint.plus(call.inputs._allocPoint.minus(pool.allocPoint))
  baoMasterFarmer.save()

  // Update pool
  pool.allocPoint = call.inputs._allocPoint
  pool.save()
}

export function setMigrator(call: SetMigratorCall): void {
  log.info('Set migrator to {}', [call.inputs._migrator.toHex()])

  const baoMasterFarmer = getBaoMasterFarmer(call.block)
  baoMasterFarmer.migrator = call.inputs._migrator
  baoMasterFarmer.save()
}

export function migrate(call: MigrateCall): void {
  const baoMasterFarmerContract = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)

  const pool = getPool(call.inputs._pid, call.block)

  const poolInfo = baoMasterFarmerContract.poolInfo(call.inputs._pid)

  const pair = poolInfo.value0

  const pairContract = PairContract.bind(pair as Address)

  pool.pair = pair

  const balance = pairContract.balanceOf(BAO_MASTER_FARMER_ADDRESS)

  pool.balance = balance

  pool.save()
}

export function massUpdatePools(call: MassUpdatePoolsCall): void {
  log.info('Mass update pools', [])
}

export function updatePool(call: UpdatePoolCall): void {
  log.info('Update pool id {}', [call.inputs._pid.toString()])

  const baoMasterFarmer = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)
  const poolInfo = baoMasterFarmer.poolInfo(call.inputs._pid)
  const pool = getPool(call.inputs._pid, call.block)
  pool.lastRewardBlock = poolInfo.value2
  pool.accBaoPerShare = poolInfo.value3
  pool.save()
}

export function dev(call: DevCall): void {
  log.info('Dev changed to {}', [call.inputs._devaddr.toHex()])

  const baoMasterFarmer = getBaoMasterFarmer(call.block)

  baoMasterFarmer.devaddr = call.inputs._devaddr

  baoMasterFarmer.save()
}

// Events
export function deposit(event: Deposit): void {
  // if (event.params.amount == BIG_INT_ZERO) {
  //   log.info('Deposit zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  /*log.info('{} has deposited {} slp tokens to pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])*/

  const baoMasterFarmerContract = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)

  const poolInfo = baoMasterFarmerContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(BAO_MASTER_FARMER_ADDRESS)

  pool.lastRewardBlock = poolInfo.value2
  pool.accBaoPerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  pool.slpAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))

  pool.slpDeposited = pool.slpDeposited.plus(amount)
  pool.slpBalance = pool.slpBalance.plus(amount)

  pool.updatedAt = event.block.timestamp

  const userInfo = baoMasterFarmerContract.userInfo(event.params.pid, event.params.user)

  const user = getUser(event.params.pid, event.params.user, event.block)

  // If not currently in pool and depositing SLP
  if (!user.pool && event.params.amount.gt(BIG_INT_ZERO)) {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
  }

  // Calculate SUSHI being paid out
  if (event.block.number.gt(BAO_MASTER_FARMER_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accBaoPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Deposit: User amount is more than zero, we should harvest {} bao', [pending.toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} SUSHI', [pending.toString()])
      const baoHarvestedUSD = pending.times(getBaoPrice(event.block))
      user.baoHarvested = user.baoHarvested.plus(pending)
      user.baoHarvestedUSD = user.baoHarvestedUSD.plus(baoHarvestedUSD)
      pool.baoHarvested = pool.baoHarvested.plus(pending)
      pool.baoHarvestedUSD = pool.baoHarvestedUSD.plus(baoHarvestedUSD)
      poolHistory.baoHarvested = pool.baoHarvested
      poolHistory.baoHarvestedUSD = pool.baoHarvestedUSD
    }
  }

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()
    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const entryUSD = token0USD.plus(token1USD)

      // log.info(
      //   'Token {} priceUSD: {} reserve: {} amount: {} / Token {} priceUSD: {} reserve: {} amount: {} - slp amount: {} total supply: {} share: {}',
      //   [
      //     token0.symbol(),
      //     token0PriceUSD.toString(),
      //     reservesResult.value.value0.toString(),
      //     token0Amount.toString(),
      //     token1.symbol(),
      //     token1PriceUSD.toString(),
      //     reservesResult.value.value1.toString(),
      //     token1Amount.toString(),
      //     amount.toString(),
      //     totalSupply.toString(),
      //     share.toString(),
      //   ]
      // )

      // log.info('User {} has deposited {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0.symbol(),
      //   token0USD.toString(),
      //   token1Amount.toString(),
      //   token1.symbol(),
      //   token1USD.toString(),
      //   entryUSD.toString(),
      // ])

      user.entryUSD = user.entryUSD.plus(entryUSD)

      pool.entryUSD = pool.entryUSD.plus(entryUSD)

      poolHistory.entryUSD = pool.entryUSD
    }
  }

  user.save()
  pool.save()

  const baoMasterFarmer = getBaoMasterFarmer(event.block)

  const baoMasterFarmerDays = event.block.timestamp.minus(baoMasterFarmer.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  baoMasterFarmer.slpAge = baoMasterFarmer.slpAge.plus(baoMasterFarmerDays.times(baoMasterFarmer.slpBalance))

  baoMasterFarmer.slpDeposited = baoMasterFarmer.slpDeposited.plus(amount)
  baoMasterFarmer.slpBalance = baoMasterFarmer.slpBalance.plus(amount)

  baoMasterFarmer.updatedAt = event.block.timestamp
  baoMasterFarmer.save()

  const history = getHistory(BAO_MASTER_FARMER_ADDRESS.toHex(), event.block)
  history.slpAge = baoMasterFarmer.slpAge
  history.slpBalance = baoMasterFarmer.slpBalance
  history.slpDeposited = history.slpDeposited.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpDeposited = poolHistory.slpDeposited.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function withdraw(event: Withdraw): void {
  // if (event.params.amount == BIG_INT_ZERO && User.load(event.params.user.toHex()) !== null) {
  //   log.info('Withdrawal zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  // log.info('{} has withdrawn {} slp tokens from pool #{}', [
  //   event.params.user.toHex(),
  //   amount.toString(),
  //   event.params.pid.toString(),
  // ])

  const baoMasterFarmerContract = BaoMasterFarmerContract.bind(BAO_MASTER_FARMER_ADDRESS)

  const poolInfo = baoMasterFarmerContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(BAO_MASTER_FARMER_ADDRESS)
  pool.lastRewardBlock = poolInfo.value2
  pool.accBaoPerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const poolAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))
  const poolAgeRemoved = poolAge.div(pool.slpBalance).times(amount)
  pool.slpAge = poolAge.minus(poolAgeRemoved)
  pool.slpAgeRemoved = pool.slpAgeRemoved.plus(poolAgeRemoved)
  pool.slpWithdrawn = pool.slpWithdrawn.plus(amount)
  pool.slpBalance = pool.slpBalance.minus(amount)
  pool.updatedAt = event.block.timestamp

  const user = getUser(event.params.pid, event.params.user, event.block)

  if (event.block.number.gt(BAO_MASTER_FARMER_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accBaoPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    // log.info('Withdraw: User amount is more than zero, we should harvest {} bao - block: {}', [
    //   pending.toString(),
    //   event.block.number.toString(),
    // ])
    // log.info('SUSHI PRICE {}', [getBaoPrice(event.block).toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      // log.info('Harvesting {} SUSHI (CURRENT SUSHI PRICE {})', [
      //   pending.toString(),
      //   getBaoPrice(event.block).toString(),
      // ])
      const baoHarvestedUSD = pending.times(getBaoPrice(event.block))
      user.baoHarvested = user.baoHarvested.plus(pending)
      user.baoHarvestedUSD = user.baoHarvestedUSD.plus(baoHarvestedUSD)
      pool.baoHarvested = pool.baoHarvested.plus(pending)
      pool.baoHarvestedUSD = pool.baoHarvestedUSD.plus(baoHarvestedUSD)
      poolHistory.baoHarvested = pool.baoHarvested
      poolHistory.baoHarvestedUSD = pool.baoHarvestedUSD
    }
  }

  const userInfo = baoMasterFarmerContract.userInfo(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()

    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const exitUSD = token0USD.plus(token1USD)

      pool.exitUSD = pool.exitUSD.plus(exitUSD)

      poolHistory.exitUSD = pool.exitUSD

      // log.info('User {} has withdrwn {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0USD.toString(),
      //   pairContract.token0().toHex(),
      //   token1Amount.toString(),
      //   token1USD.toString(),
      //   pairContract.token1().toHex(),
      //   exitUSD.toString(),
      // ])

      user.exitUSD = user.exitUSD.plus(exitUSD)
    } else {
      log.info("Withdraw couldn't get reserves for pair {}", [poolInfo.value0.toHex()])
    }
  }

  // If SLP amount equals zero, remove from pool and reduce userCount
  if (user.amount.equals(BIG_INT_ZERO)) {
    user.pool = null
    pool.userCount = pool.userCount.minus(BIG_INT_ONE)
  }

  user.save()
  pool.save()

  const baoMasterFarmer = getBaoMasterFarmer(event.block)

  const days = event.block.timestamp.minus(baoMasterFarmer.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const slpAge = baoMasterFarmer.slpAge.plus(days.times(baoMasterFarmer.slpBalance))
  const slpAgeRemoved = slpAge.div(baoMasterFarmer.slpBalance).times(amount)
  baoMasterFarmer.slpAge = slpAge.minus(slpAgeRemoved)
  baoMasterFarmer.slpAgeRemoved = baoMasterFarmer.slpAgeRemoved.plus(slpAgeRemoved)

  baoMasterFarmer.slpWithdrawn = baoMasterFarmer.slpWithdrawn.plus(amount)
  baoMasterFarmer.slpBalance = baoMasterFarmer.slpBalance.minus(amount)
  baoMasterFarmer.updatedAt = event.block.timestamp
  baoMasterFarmer.save()

  const history = getHistory(BAO_MASTER_FARMER_ADDRESS.toHex(), event.block)
  history.slpAge = baoMasterFarmer.slpAge
  history.slpAgeRemoved = history.slpAgeRemoved.plus(slpAgeRemoved)
  history.slpBalance = baoMasterFarmer.slpBalance
  history.slpWithdrawn = history.slpWithdrawn.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpAgeRemoved = poolHistory.slpAgeRemoved.plus(slpAgeRemoved)
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpWithdrawn = poolHistory.slpWithdrawn.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('User {} emergancy withdrawal of {} from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const pool = getPool(event.params.pid, event.block)

  const pairContract = PairContract.bind(pool.pair as Address)
  pool.balance = pairContract.balanceOf(BAO_MASTER_FARMER_ADDRESS)
  pool.save()

  // Update user
  const user = getUser(event.params.pid, event.params.user, event.block)
  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO

  user.save()
}

export function ownershipTransferred(event: OwnershipTransferred): void {
  log.info('Ownership transfered from previous owner: {} to new owner: {}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])
}
