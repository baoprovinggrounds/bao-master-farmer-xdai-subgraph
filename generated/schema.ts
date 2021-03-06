// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class BaoMasterFarmer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BaoMasterFarmer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BaoMasterFarmer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BaoMasterFarmer", id.toString(), this);
  }

  static load(id: string): BaoMasterFarmer | null {
    return store.get("BaoMasterFarmer", id) as BaoMasterFarmer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get REWARD_MULTIPLIER(): BigInt {
    let value = this.get("REWARD_MULTIPLIER");
    return value.toBigInt();
  }

  set REWARD_MULTIPLIER(value: BigInt) {
    this.set("REWARD_MULTIPLIER", Value.fromBigInt(value));
  }

  get FINISH_BONUS_AT_BLOCK(): BigInt {
    let value = this.get("FINISH_BONUS_AT_BLOCK");
    return value.toBigInt();
  }

  set FINISH_BONUS_AT_BLOCK(value: BigInt) {
    this.set("FINISH_BONUS_AT_BLOCK", Value.fromBigInt(value));
  }

  get devaddr(): Bytes {
    let value = this.get("devaddr");
    return value.toBytes();
  }

  set devaddr(value: Bytes) {
    this.set("devaddr", Value.fromBytes(value));
  }

  get migrator(): Bytes {
    let value = this.get("migrator");
    return value.toBytes();
  }

  set migrator(value: Bytes) {
    this.set("migrator", Value.fromBytes(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get START_BLOCK(): BigInt {
    let value = this.get("START_BLOCK");
    return value.toBigInt();
  }

  set START_BLOCK(value: BigInt) {
    this.set("START_BLOCK", Value.fromBigInt(value));
  }

  get bao(): Bytes {
    let value = this.get("bao");
    return value.toBytes();
  }

  set bao(value: Bytes) {
    this.set("bao", Value.fromBytes(value));
  }

  get REWARD_PER_BLOCK(): BigInt {
    let value = this.get("REWARD_PER_BLOCK");
    return value.toBigInt();
  }

  set REWARD_PER_BLOCK(value: BigInt) {
    this.set("REWARD_PER_BLOCK", Value.fromBigInt(value));
  }

  get totalAllocPoint(): BigInt {
    let value = this.get("totalAllocPoint");
    return value.toBigInt();
  }

  set totalAllocPoint(value: BigInt) {
    this.set("totalAllocPoint", Value.fromBigInt(value));
  }

  get pools(): Array<string> {
    let value = this.get("pools");
    return value.toStringArray();
  }

  set pools(value: Array<string>) {
    this.set("pools", Value.fromStringArray(value));
  }

  get poolCount(): BigInt {
    let value = this.get("poolCount");
    return value.toBigInt();
  }

  set poolCount(value: BigInt) {
    this.set("poolCount", Value.fromBigInt(value));
  }

  get slpBalance(): BigDecimal {
    let value = this.get("slpBalance");
    return value.toBigDecimal();
  }

  set slpBalance(value: BigDecimal) {
    this.set("slpBalance", Value.fromBigDecimal(value));
  }

  get slpAge(): BigDecimal {
    let value = this.get("slpAge");
    return value.toBigDecimal();
  }

  set slpAge(value: BigDecimal) {
    this.set("slpAge", Value.fromBigDecimal(value));
  }

  get slpAgeRemoved(): BigDecimal {
    let value = this.get("slpAgeRemoved");
    return value.toBigDecimal();
  }

  set slpAgeRemoved(value: BigDecimal) {
    this.set("slpAgeRemoved", Value.fromBigDecimal(value));
  }

  get slpDeposited(): BigDecimal {
    let value = this.get("slpDeposited");
    return value.toBigDecimal();
  }

  set slpDeposited(value: BigDecimal) {
    this.set("slpDeposited", Value.fromBigDecimal(value));
  }

  get slpWithdrawn(): BigDecimal {
    let value = this.get("slpWithdrawn");
    return value.toBigDecimal();
  }

  set slpWithdrawn(value: BigDecimal) {
    this.set("slpWithdrawn", Value.fromBigDecimal(value));
  }

  get history(): Array<string> {
    let value = this.get("history");
    return value.toStringArray();
  }

  set history(value: Array<string>) {
    this.set("history", Value.fromStringArray(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }
}

export class History extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save History entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save History entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("History", id.toString(), this);
  }

  static load(id: string): History | null {
    return store.get("History", id) as History | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get slpBalance(): BigDecimal {
    let value = this.get("slpBalance");
    return value.toBigDecimal();
  }

  set slpBalance(value: BigDecimal) {
    this.set("slpBalance", Value.fromBigDecimal(value));
  }

  get slpAge(): BigDecimal {
    let value = this.get("slpAge");
    return value.toBigDecimal();
  }

  set slpAge(value: BigDecimal) {
    this.set("slpAge", Value.fromBigDecimal(value));
  }

  get slpAgeRemoved(): BigDecimal {
    let value = this.get("slpAgeRemoved");
    return value.toBigDecimal();
  }

  set slpAgeRemoved(value: BigDecimal) {
    this.set("slpAgeRemoved", Value.fromBigDecimal(value));
  }

  get slpDeposited(): BigDecimal {
    let value = this.get("slpDeposited");
    return value.toBigDecimal();
  }

  set slpDeposited(value: BigDecimal) {
    this.set("slpDeposited", Value.fromBigDecimal(value));
  }

  get slpWithdrawn(): BigDecimal {
    let value = this.get("slpWithdrawn");
    return value.toBigDecimal();
  }

  set slpWithdrawn(value: BigDecimal) {
    this.set("slpWithdrawn", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }
}

export class Pool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Pool entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Pool entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Pool", id.toString(), this);
  }

  static load(id: string): Pool | null {
    return store.get("Pool", id) as Pool | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get pair(): Bytes {
    let value = this.get("pair");
    return value.toBytes();
  }

  set pair(value: Bytes) {
    this.set("pair", Value.fromBytes(value));
  }

  get allocPoint(): BigInt {
    let value = this.get("allocPoint");
    return value.toBigInt();
  }

  set allocPoint(value: BigInt) {
    this.set("allocPoint", Value.fromBigInt(value));
  }

  get lastRewardBlock(): BigInt {
    let value = this.get("lastRewardBlock");
    return value.toBigInt();
  }

  set lastRewardBlock(value: BigInt) {
    this.set("lastRewardBlock", Value.fromBigInt(value));
  }

  get accBaoPerShare(): BigInt {
    let value = this.get("accBaoPerShare");
    return value.toBigInt();
  }

  set accBaoPerShare(value: BigInt) {
    this.set("accBaoPerShare", Value.fromBigInt(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get users(): Array<string> {
    let value = this.get("users");
    return value.toStringArray();
  }

  set users(value: Array<string>) {
    this.set("users", Value.fromStringArray(value));
  }

  get userCount(): BigInt {
    let value = this.get("userCount");
    return value.toBigInt();
  }

  set userCount(value: BigInt) {
    this.set("userCount", Value.fromBigInt(value));
  }

  get slpBalance(): BigDecimal {
    let value = this.get("slpBalance");
    return value.toBigDecimal();
  }

  set slpBalance(value: BigDecimal) {
    this.set("slpBalance", Value.fromBigDecimal(value));
  }

  get slpAge(): BigDecimal {
    let value = this.get("slpAge");
    return value.toBigDecimal();
  }

  set slpAge(value: BigDecimal) {
    this.set("slpAge", Value.fromBigDecimal(value));
  }

  get slpAgeRemoved(): BigDecimal {
    let value = this.get("slpAgeRemoved");
    return value.toBigDecimal();
  }

  set slpAgeRemoved(value: BigDecimal) {
    this.set("slpAgeRemoved", Value.fromBigDecimal(value));
  }

  get slpDeposited(): BigDecimal {
    let value = this.get("slpDeposited");
    return value.toBigDecimal();
  }

  set slpDeposited(value: BigDecimal) {
    this.set("slpDeposited", Value.fromBigDecimal(value));
  }

  get slpWithdrawn(): BigDecimal {
    let value = this.get("slpWithdrawn");
    return value.toBigDecimal();
  }

  set slpWithdrawn(value: BigDecimal) {
    this.set("slpWithdrawn", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }

  get entryUSD(): BigDecimal {
    let value = this.get("entryUSD");
    return value.toBigDecimal();
  }

  set entryUSD(value: BigDecimal) {
    this.set("entryUSD", Value.fromBigDecimal(value));
  }

  get exitUSD(): BigDecimal {
    let value = this.get("exitUSD");
    return value.toBigDecimal();
  }

  set exitUSD(value: BigDecimal) {
    this.set("exitUSD", Value.fromBigDecimal(value));
  }

  get baoHarvested(): BigDecimal {
    let value = this.get("baoHarvested");
    return value.toBigDecimal();
  }

  set baoHarvested(value: BigDecimal) {
    this.set("baoHarvested", Value.fromBigDecimal(value));
  }

  get baoHarvestedUSD(): BigDecimal {
    let value = this.get("baoHarvestedUSD");
    return value.toBigDecimal();
  }

  set baoHarvestedUSD(value: BigDecimal) {
    this.set("baoHarvestedUSD", Value.fromBigDecimal(value));
  }
}

export class PoolHistory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PoolHistory entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PoolHistory entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PoolHistory", id.toString(), this);
  }

  static load(id: string): PoolHistory | null {
    return store.get("PoolHistory", id) as PoolHistory | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get pool(): string {
    let value = this.get("pool");
    return value.toString();
  }

  set pool(value: string) {
    this.set("pool", Value.fromString(value));
  }

  get slpBalance(): BigDecimal {
    let value = this.get("slpBalance");
    return value.toBigDecimal();
  }

  set slpBalance(value: BigDecimal) {
    this.set("slpBalance", Value.fromBigDecimal(value));
  }

  get slpAge(): BigDecimal {
    let value = this.get("slpAge");
    return value.toBigDecimal();
  }

  set slpAge(value: BigDecimal) {
    this.set("slpAge", Value.fromBigDecimal(value));
  }

  get slpAgeRemoved(): BigDecimal {
    let value = this.get("slpAgeRemoved");
    return value.toBigDecimal();
  }

  set slpAgeRemoved(value: BigDecimal) {
    this.set("slpAgeRemoved", Value.fromBigDecimal(value));
  }

  get slpDeposited(): BigDecimal {
    let value = this.get("slpDeposited");
    return value.toBigDecimal();
  }

  set slpDeposited(value: BigDecimal) {
    this.set("slpDeposited", Value.fromBigDecimal(value));
  }

  get slpWithdrawn(): BigDecimal {
    let value = this.get("slpWithdrawn");
    return value.toBigDecimal();
  }

  set slpWithdrawn(value: BigDecimal) {
    this.set("slpWithdrawn", Value.fromBigDecimal(value));
  }

  get userCount(): BigInt {
    let value = this.get("userCount");
    return value.toBigInt();
  }

  set userCount(value: BigInt) {
    this.set("userCount", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }

  get entryUSD(): BigDecimal {
    let value = this.get("entryUSD");
    return value.toBigDecimal();
  }

  set entryUSD(value: BigDecimal) {
    this.set("entryUSD", Value.fromBigDecimal(value));
  }

  get exitUSD(): BigDecimal {
    let value = this.get("exitUSD");
    return value.toBigDecimal();
  }

  set exitUSD(value: BigDecimal) {
    this.set("exitUSD", Value.fromBigDecimal(value));
  }

  get baoHarvested(): BigDecimal {
    let value = this.get("baoHarvested");
    return value.toBigDecimal();
  }

  set baoHarvested(value: BigDecimal) {
    this.set("baoHarvested", Value.fromBigDecimal(value));
  }

  get baoHarvestedUSD(): BigDecimal {
    let value = this.get("baoHarvestedUSD");
    return value.toBigDecimal();
  }

  set baoHarvestedUSD(value: BigDecimal) {
    this.set("baoHarvestedUSD", Value.fromBigDecimal(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get pool(): string | null {
    let value = this.get("pool");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set pool(value: string | null) {
    if (value === null) {
      this.unset("pool");
    } else {
      this.set("pool", Value.fromString(value as string));
    }
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get rewardDebt(): BigInt {
    let value = this.get("rewardDebt");
    return value.toBigInt();
  }

  set rewardDebt(value: BigInt) {
    this.set("rewardDebt", Value.fromBigInt(value));
  }

  get entryUSD(): BigDecimal {
    let value = this.get("entryUSD");
    return value.toBigDecimal();
  }

  set entryUSD(value: BigDecimal) {
    this.set("entryUSD", Value.fromBigDecimal(value));
  }

  get exitUSD(): BigDecimal {
    let value = this.get("exitUSD");
    return value.toBigDecimal();
  }

  set exitUSD(value: BigDecimal) {
    this.set("exitUSD", Value.fromBigDecimal(value));
  }

  get baoHarvested(): BigDecimal {
    let value = this.get("baoHarvested");
    return value.toBigDecimal();
  }

  set baoHarvested(value: BigDecimal) {
    this.set("baoHarvested", Value.fromBigDecimal(value));
  }

  get baoHarvestedUSD(): BigDecimal {
    let value = this.get("baoHarvestedUSD");
    return value.toBigDecimal();
  }

  set baoHarvestedUSD(value: BigDecimal) {
    this.set("baoHarvestedUSD", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get block(): BigInt {
    let value = this.get("block");
    return value.toBigInt();
  }

  set block(value: BigInt) {
    this.set("block", Value.fromBigInt(value));
  }
}
