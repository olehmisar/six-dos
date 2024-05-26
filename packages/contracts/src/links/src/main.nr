contract Links {
    use dep::aztec::prelude::{AztecAddress, PrivateImmutable, PrivateMutable, PublicMutable, Map, PrivateSet};
    use dep::aztec::protocol_types::{hash::pedersen_hash, traits::ToField};
    use dep::value_note::value_note::ValueNote;
    use dep::address_note::address_note::AddressNote;
    use dep::aztec::keys::getters::{get_npk_m_hash, get_ivpk_m};

    use dep::module_interface::ModuleInterface;

    #[aztec(storage)]
    struct Storage {
        links: Map<LinkKey, PrivateMutable<AddressNote>>,
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor() {}

    #[aztec(private)]
    fn add_link(to: AztecAddress, module: AztecAddress, is_init: bool) {
        let from = context.msg_sender();

        /////////////////////////////////////////////
        // ENCRYPT the link with `from` public key //
        /////////////////////////////////////////////
        let a_npk_m_hash = get_npk_m_hash(&mut context, from);
        let a_ivpk_m = get_ivpk_m(&mut context, from);
        let key = LinkKey { from, to, module };
        let broadcast = true;
        let mut note = AddressNote::new(module, a_npk_m_hash);

        if (is_init) {
            storage.links.at(key).initialize(&mut note, broadcast, a_ivpk_m);
        } else {
            assert(storage.links.at(key).get_note(broadcast, a_ivpk_m).address == AztecAddress::empty());
            storage.links.at(key).replace(&mut note, broadcast, a_ivpk_m);
        }
    }

    #[aztec(private)]
    fn assert_linked_to(from: AztecAddress, to: AztecAddress, module: AztecAddress) {
        let a_ivpk_m = get_ivpk_m(&mut context, from);
        let broadcast = true;
        let module_address = storage.links.at(LinkKey { from, to, module }).get_note(broadcast, a_ivpk_m).address;
        assert(module_address != AztecAddress::empty());
        let return_value = ModuleInterface::at(module_address).links_callback(from, to).call(&mut context);
        assert(return_value == 1);
    }

    unconstrained fn link_is_initialized(from: AztecAddress, to: AztecAddress, module: AztecAddress) -> pub bool {
        storage.links.at(LinkKey { from, to, module }).is_initialized()
    }

    struct LinkKey {
        from: AztecAddress,
        to: AztecAddress,
        /// Contract address that decides the logic of the link
        module: AztecAddress,
    }

    impl ToField for LinkKey {
        fn to_field(self) -> Field {
            pedersen_hash([self.from.to_field(), self.to.to_field(), self.module.to_field()], 0)
        }
    }
}
