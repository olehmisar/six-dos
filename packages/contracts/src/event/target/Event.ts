
/* Autogenerated file, do not edit! */

/* eslint-disable */
import {
  AztecAddress,
  AztecAddressLike,
  CompleteAddress,
  Contract,
  ContractArtifact,
  ContractBase,
  ContractFunctionInteraction,
  ContractInstanceWithAddress,
  ContractMethod,
  ContractStorageLayout,
  ContractNotes,
  DeployMethod,
  EthAddress,
  EthAddressLike,
  FieldLike,
  Fr,
  FunctionSelectorLike,
  loadContractArtifact,
  NoirCompiledContract,
  Point,
  PublicKey,
  Wallet,
  WrappedFieldLike,
} from '@aztec/aztec.js';
import EventContractArtifactJson from './event-Event.json' assert { type: 'json' };
export const EventContractArtifact = loadContractArtifact(EventContractArtifactJson as NoirCompiledContract);

/**
 * Type-safe interface for contract Event;
 */
export class EventContract extends ContractBase {
  
  private constructor(
    instance: ContractInstanceWithAddress,
    wallet: Wallet,
  ) {
    super(instance, EventContractArtifact, wallet);
  }
  

  
  /**
   * Creates a contract instance.
   * @param address - The deployed contract's address.
   * @param wallet - The wallet to use when interacting with the contract.
   * @returns A promise that resolves to a new Contract instance.
   */
  public static async at(
    address: AztecAddress,
    wallet: Wallet,
  ) {
    return Contract.at(address, EventContract.artifact, wallet) as Promise<EventContract>;
  }

  
  /**
   * Creates a tx to deploy a new instance of this contract.
   */
  public static deploy(wallet: Wallet, owner_address: AztecAddressLike, links_contract: AztecAddressLike) {
    return new DeployMethod<EventContract>(Fr.ZERO, wallet, EventContractArtifact, EventContract.at, Array.from(arguments).slice(1));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified public keys hash to derive the address.
   */
  public static deployWithPublicKeysHash(publicKeysHash: Fr, wallet: Wallet, owner_address: AztecAddressLike, links_contract: AztecAddressLike) {
    return new DeployMethod<EventContract>(publicKeysHash, wallet, EventContractArtifact, EventContract.at, Array.from(arguments).slice(2));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified constructor method.
   */
  public static deployWithOpts<M extends keyof EventContract['methods']>(
    opts: { publicKeysHash?: Fr; method?: M; wallet: Wallet },
    ...args: Parameters<EventContract['methods'][M]>
  ) {
    return new DeployMethod<EventContract>(
      opts.publicKeysHash ?? Fr.ZERO,
      opts.wallet,
      EventContractArtifact,
      EventContract.at,
      Array.from(arguments).slice(1),
      opts.method ?? 'constructor',
    );
  }
  

  
  /**
   * Returns this contract's artifact.
   */
  public static get artifact(): ContractArtifact {
    return EventContractArtifact;
  }
  

  public static get storage(): ContractStorageLayout<'owner_address' | 'links_contract' | 'degree_of' | 'max_allowed_degree'> {
      return {
        owner_address: {
      slot: new Fr(1n),
      typ: "SharedImmutable<AztecAddress, Context>",
    },
links_contract: {
      slot: new Fr(2n),
      typ: "SharedImmutable<AztecAddress, Context>",
    },
degree_of: {
      slot: new Fr(3n),
      typ: "Map<AztecAddress, PrivateMutable<ValueNote, Context>, Context>",
    },
max_allowed_degree: {
      slot: new Fr(4n),
      typ: "PublicMutable<Field, Context>",
    }
      } as ContractStorageLayout<'owner_address' | 'links_contract' | 'degree_of' | 'max_allowed_degree'>;
    }
    

  public static get notes(): ContractNotes<'ValueNote'> {
    return {
      ValueNote: {
          id: new Fr(869710811710178111116101n),
        }
    } as ContractNotes<'ValueNote'>;
  }
  

  /** Type-safe wrappers for the public methods exposed by the contract. */
  public override methods!: {
    
    /** assert_degree(associate: struct, associate_degree: field) */
    assert_degree: ((associate: AztecAddressLike, associate_degree: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** constructor(owner_address: struct, links_contract: struct) */
    constructor: ((owner_address: AztecAddressLike, links_contract: AztecAddressLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** compute_note_hash_and_nullifier(contract_address: struct, nonce: field, storage_slot: field, note_type_id: field, serialized_note: array) */
    compute_note_hash_and_nullifier: ((contract_address: AztecAddressLike, nonce: FieldLike, storage_slot: FieldLike, note_type_id: FieldLike, serialized_note: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
  };
}