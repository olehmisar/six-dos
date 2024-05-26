contract Event {
    use dep::aztec::prelude::{AztecAddress, PrivateImmutable, PrivateMutable, PublicMutable, SharedImmutable, Map, PrivateSet};
    use dep::value_note::value_note::ValueNote;
    use dep::aztec::keys::getters::{get_npk_m_hash, get_ivpk_m};

    use dep::links::Links;

    #[aztec(storage)]
    struct Storage {
        /// The address of the person who created the event
        owner_address: SharedImmutable<AztecAddress>,
        /// The address of the Links contract that verifies the association between people
        links_contract: SharedImmutable<AztecAddress>,
        /// We only check if link exists, so we use the BoolModule
        links_module: SharedImmutable<AztecAddress>,
        /// Owner can see degrees of separation of all associates to the owner
        owner_degree_of: Map<AztecAddress, PrivateImmutable<ValueNote>>,
        /// Associates can see their own degree of separation to the owner
        associate_degree_of: Map<AztecAddress, PrivateImmutable<ValueNote>>,
        /// Up to what degree of separation can the people join the event
        max_degree: SharedImmutable<Field>,
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor(
        owner_address: AztecAddress,
        links_contract: AztecAddress,
        links_module: AztecAddress,
        max_degree: Field
    ) {
        let broadcast = true;
        let mut owner_npk_m_hash = get_npk_m_hash(&mut context, owner_address);
        let mut owner_ivpk_m = get_ivpk_m(&mut context, owner_address);
        // ENCRYPT BOTH with the owner's public key
        storage.associate_degree_of.at(owner_address).initialize(
            &mut ValueNote::new(0, owner_npk_m_hash),
            broadcast,
            owner_ivpk_m
        );
        storage.owner_degree_of.at(owner_address).initialize(
            &mut ValueNote::new(0, owner_npk_m_hash),
            broadcast,
            owner_ivpk_m
        );

        Event::at(context.this_address()).constructor_public(owner_address, links_contract, links_module, max_degree).enqueue(&mut context);
    }

    #[aztec(public)]
    #[aztec(internal)]
    #[aztec(noinitcheck)]
    fn constructor_public(
        owner_address: AztecAddress,
        links_contract: AztecAddress,
        links_module: AztecAddress,
        max_degree: Field
    ) {
        storage.owner_address.initialize(owner_address);
        storage.links_contract.initialize(links_contract);
        storage.links_module.initialize(links_module);
        storage.max_degree.initialize(max_degree);
    }

    #[aztec(private)]
    fn assert_associated_with_me(new_associate: AztecAddress) {
        let current_associate = context.msg_sender();
        Links::at(storage.links_contract.read_private()).assert_linked_to(
            current_associate,
            new_associate,
            storage.links_module.read_private()
        ).call(&mut context);

        let current_associate_degree = storage.associate_degree_of.at(current_associate).get_note().value;
        let new_associate_degree = current_associate_degree + 1;
        assert(new_associate_degree as u64 <= storage.max_degree.read_private() as u64);

        let broadcast = true;
        /////////////////////////////////////////////
        // ENCRYPT the degree of the new associate //
        // with the event owner's public key       //
        /////////////////////////////////////////////
        let owner = storage.owner_address.read_private();
        let owner_npk_m_hash = get_npk_m_hash(&mut context, owner);
        let owner_ivpk_m = get_ivpk_m(&mut context, owner);
        storage.owner_degree_of.at(new_associate).initialize(
            &mut ValueNote::new(new_associate_degree, owner_npk_m_hash),
            broadcast,
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
            broadcast,
            new_associate_ivpk_m
        );
    }

    #[aztec(public)]
    #[aztec(view)]
    fn max_degree() -> pub Field {
        storage.max_degree.read_public()
    }

    #[aztec(public)]
    #[aztec(view)]
    fn links_module() -> pub AztecAddress {
        storage.links_module.read_public()
    }

    unconstrained fn owner_get_degree_of(associate: AztecAddress) -> pub Field {
        // Owner can see the degree of separation of all associates. This function will revert if the caller is not the owner.
        storage.owner_degree_of.at(associate).view_note().value
    }

    unconstrained fn associate_get_degree_of(associate: AztecAddress) -> pub Field {
        // It's encrypted, so associates can only see their own degree of separation
        storage.associate_degree_of.at(associate).view_note().value
    }
}
