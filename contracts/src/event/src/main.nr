contract Event {
    use dep::aztec::prelude::{AztecAddress, NoteHeader, PrivateImmutable, PrivateContext, PublicMutable, SharedImmutable, Map, PrivateSet};
    use dep::easy_private_state::EasyPrivateUint;
    use dep::aztec::{hash::compute_secret_hash, note::{note_getter_options::NoteGetterOptions}};
    use dep::value_note::value_note::ValueNote;
    use dep::authwit::{auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public}};

    #[aztec(storage)]
    struct Storage {
        links_contract: SharedImmutable<AztecAddress>,
        proofs: Map<AztecAddress, PrivateImmutable<ValueNote>>,
    }

    #[aztec(public)]
    #[aztec(initializer)]
    fn constructor(links_contract: AztecAddress) {
        storage.links_contract.initialize(links_contract);
    }
}
