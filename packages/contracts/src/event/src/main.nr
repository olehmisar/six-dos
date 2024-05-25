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
        owner_degree_of: Map<AztecAddress, PrivateImmutable<ValueNote>>,
        associate_degree_of: Map<AztecAddress, PrivateImmutable<ValueNote>>,
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor(owner_address: AztecAddress, links_contract: AztecAddress) {
        let mut owner_npk_m_hash = get_npk_m_hash(&mut context, owner_address);
        let mut owner_ivpk_m = get_ivpk_m(&mut context, owner_address);
        // ENCRYPT BOTH with the owner's public key
        storage.associate_degree_of.at(owner_address).initialize(
            &mut ValueNote::new(0, owner_npk_m_hash),
            true,
            owner_ivpk_m
        );
        storage.owner_degree_of.at(owner_address).initialize(
            &mut ValueNote::new(0, owner_npk_m_hash),
            true,
            owner_ivpk_m
        );

        Event::at(context.this_address()).constructor_public(owner_address, links_contract).enqueue(&mut context);
    }

    #[aztec(public)]
    #[aztec(internal)]
    #[aztec(noinitcheck)]
    fn constructor_public(owner_address: AztecAddress, links_contract: AztecAddress) {
        storage.owner_address.initialize(owner_address);
        storage.links_contract.initialize(links_contract);
    }

    #[aztec(private)]
    fn assert_associated_with_me(new_associate: AztecAddress) {
        let current_associate = context.msg_sender();
        Links::at(storage.links_contract.read_private()).assert_linked_to(current_associate, new_associate).call(&mut context);

        let current_associate_degree = storage.associate_degree_of.at(current_associate).get_note().value;
        let new_associate_degree = current_associate_degree + 1;

        /////////////////////////////////////////////
        // ENCRYPT the degree of the new associate //
        // with the event owner's public key       //
        /////////////////////////////////////////////
        let owner = storage.owner_address.read_private();
        let owner_npk_m_hash = get_npk_m_hash(&mut context, owner);
        let owner_ivpk_m = get_ivpk_m(&mut context, owner);
        storage.owner_degree_of.at(new_associate).initialize(
            &mut ValueNote::new(new_associate_degree, owner_npk_m_hash),
            true,
            owner_ivpk_m
        );

        /////////////////////////////////////////////
        // ENCRYPT the degree of the new associate //
        // with the new associate's public key     //
        /////////////////////////////////////////////
        let new_associate_npk_m_hash = get_npk_m_hash(&mut context, new_associate);
        let new_associate_ivpk_m = get_ivpk_m(&mut context, new_associate);
        storage.associate_degree_of.at(new_associate).initialize(
            &mut ValueNote::new(new_associate_degree, new_associate_npk_m_hash),
            true,
            new_associate_ivpk_m
        );
    }

    unconstrained fn owner_get_degree_of(associate: AztecAddress) -> pub Field {
        storage.owner_degree_of.at(associate).view_note().value
    }
}
