
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
import LinksContractArtifactJson from './links-Links.json' assert { type: 'json' };
export const LinksContractArtifact = loadContractArtifact(LinksContractArtifactJson as NoirCompiledContract);

/**
 * Type-safe interface for contract Links;
 */
export class LinksContract extends ContractBase {
  
  private constructor(
    instance: ContractInstanceWithAddress,
    wallet: Wallet,
  ) {
    super(instance, LinksContractArtifact, wallet);
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
    return Contract.at(address, LinksContract.artifact, wallet) as Promise<LinksContract>;
  }

  
  /**
   * Creates a tx to deploy a new instance of this contract.
   */
  public static deploy(wallet: Wallet, ) {
    return new DeployMethod<LinksContract>(Fr.ZERO, wallet, LinksContractArtifact, LinksContract.at, Array.from(arguments).slice(1));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified public keys hash to derive the address.
   */
  public static deployWithPublicKeysHash(publicKeysHash: Fr, wallet: Wallet, ) {
    return new DeployMethod<LinksContract>(publicKeysHash, wallet, LinksContractArtifact, LinksContract.at, Array.from(arguments).slice(2));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified constructor method.
   */
  public static deployWithOpts<M extends keyof LinksContract['methods']>(
    opts: { publicKeysHash?: Fr; method?: M; wallet: Wallet },
    ...args: Parameters<LinksContract['methods'][M]>
  ) {
    return new DeployMethod<LinksContract>(
      opts.publicKeysHash ?? Fr.ZERO,
      opts.wallet,
      LinksContractArtifact,
      LinksContract.at,
      Array.from(arguments).slice(1),
      opts.method ?? 'constructor',
    );
  }
  

  
  /**
   * Returns this contract's artifact.
   */
  public static get artifact(): ContractArtifact {
    return LinksContractArtifact;
  }
  

  public static get storage(): ContractStorageLayout<'links'> {
      return {
        links: {
      slot: new Fr(1n),
      typ: "Map<LinkKey, PrivateMutable<ValueNote, Context>, Context>",
    }
      } as ContractStorageLayout<'links'>;
    }
    

  public static get notes(): ContractNotes<'AddressNote' | 'ValueNote'> {
    return {
      AddressNote: {
          id: new Fr(6510010011410111511578111116101n),
        },
ValueNote: {
          id: new Fr(869710811710178111116101n),
        }
    } as ContractNotes<'AddressNote' | 'ValueNote'>;
  }
  

  /** Type-safe wrappers for the public methods exposed by the contract. */
  public override methods!: {
    
    /** constructor() */
    constructor: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** assert_linked_to(from: struct, to: struct) */
    assert_linked_to: ((from: AztecAddressLike, to: AztecAddressLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** link_exists(from: struct, to: struct) */
    link_exists: ((from: AztecAddressLike, to: AztecAddressLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** compute_note_hash_and_nullifier(contract_address: struct, nonce: field, storage_slot: field, note_type_id: field, serialized_note: array) */
    compute_note_hash_and_nullifier: ((contract_address: AztecAddressLike, nonce: FieldLike, storage_slot: FieldLike, note_type_id: FieldLike, serialized_note: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** add_link(to: struct, is_init: boolean) */
    add_link: ((to: AztecAddressLike, is_init: boolean) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
  };
}
