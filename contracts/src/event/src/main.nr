contract Event {
    use dep::aztec::prelude::{AztecAddress, NoteHeader, PrivateImmutable, PrivateContext, PublicMutable, SharedImmutable, Map, PrivateSet};
    use dep::easy_private_state::EasyPrivateUint;
    use dep::aztec::{hash::compute_secret_hash, note::{note_getter_options::NoteGetterOptions}};
    use dep::value_note::value_note::ValueNote;
    use dep::authwit::{auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public}};

    use dep::links::Links;

    #[aztec(storage)]
    struct Storage {
        /// The address of the person who created the event
        owner_address: SharedImmutable<AztecAddress>,
        links_contract: SharedImmutable<AztecAddress>,
        proofs: Map<AztecAddress, PrivateImmutable<ValueNote>>,
        max_allowed_degree: PublicMutable<Field>,
    }

    #[aztec(public)]
    #[aztec(initializer)]
    fn constructor(owner_address: AztecAddress, links_contract: AztecAddress) {
        storage.owner_address.initialize(owner_address);
        storage.links_contract.initialize(links_contract);
    }

    #[aztec(private)]
    fn assert_degree(friend: AztecAddress, friend_degree: Field) {
        let me = context.msg_sender();
        Links::at(storage.links_contract.read_private()).assert_linked_to(me, friend).call(&mut context);
        let my_degree = friend_degree + 1;
        // assert(my_degree <= storage.max_allowed_degree.read());
        // TODO
        // storage.degree_of.set(...)
        // degree_of[me] = my_degree;
    }
}
