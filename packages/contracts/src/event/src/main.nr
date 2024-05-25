contract Event {
    use dep::aztec::prelude::{AztecAddress, PrivateImmutable, PrivateMutable, PublicMutable, SharedImmutable, Map, PrivateSet};
    use dep::easy_private_state::EasyPrivateUint;
    use dep::aztec::{hash::compute_secret_hash, note::{note_getter_options::NoteGetterOptions}};
    use dep::value_note::value_note::ValueNote;
    use dep::authwit::{auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public}};
    use dep::aztec::keys::getters::{get_npk_m_hash, get_ivpk_m};

    use dep::links::Links;

    #[aztec(storage)]
    struct Storage {
        /// The address of the person who created the event
        owner_address: SharedImmutable<AztecAddress>,
        links_contract: SharedImmutable<AztecAddress>,
        degree_of: Map<AztecAddress, PrivateMutable<ValueNote>>,
        max_allowed_degree: PublicMutable<Field>,
    }

    #[aztec(public)]
    #[aztec(initializer)]
    fn constructor(owner_address: AztecAddress, links_contract: AztecAddress) {
        storage.owner_address.initialize(owner_address);
        storage.links_contract.initialize(links_contract);
    }

    #[aztec(private)]
    fn assert_degree(associate: AztecAddress, associate_degree: Field) {
        let new_associate = context.msg_sender();
        Links::at(storage.links_contract.read_private()).assert_linked_to(associate, new_associate).call(&mut context);
        let my_degree = associate_degree + 1;
        // assert(my_degree <= storage.max_allowed_degree.read());

        let owner = storage.owner_address.read_private();
        let owner_npk_m_hash = get_npk_m_hash(&mut context, owner);
        let owner_ivpk_m = get_ivpk_m(&mut context, owner);
        storage.degree_of.at(new_associate).replace(
            &mut ValueNote::new(my_degree, owner_npk_m_hash),
            true,
            owner_ivpk_m
        );
    }
}
