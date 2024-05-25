contract Links {
    use dep::aztec::prelude::{AztecAddress, PrivateImmutable, PrivateMutable, PublicMutable, Map, PrivateSet, NoteHeader, PrivateContext};
    use dep::aztec::protocol_types::{hash::pedersen_hash, traits::ToField};
    use dep::easy_private_state::EasyPrivateUint;
    use dep::value_note::value_note::ValueNote;
    use dep::aztec::{hash::compute_secret_hash, note::note_getter_options::NoteGetterOptions};
    use dep::authwit::auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public};
    use dep::aztec::keys::getters::{get_npk_m_hash, get_ivpk_m};

    #[aztec(storage)]
    struct Storage {
        links: Map<LinkKey, PrivateMutable<ValueNote>>,
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor() {}

    #[aztec(private)]
    fn add_link(from: AztecAddress, to: AztecAddress, is_init: bool) {
        // TODO: use authwit
        assert(context.msg_sender() == from);

        /////////////////////////////////////////////
        // ENCRYPT the link with `from` public key //
        /////////////////////////////////////////////
        let a_npk_m_hash = get_npk_m_hash(&mut context, from);
        let a_ivpk_m = get_ivpk_m(&mut context, from);
        let key = LinkKey { from, to };
        let broadcast = true;
        let mut note = ValueNote::new(1, a_npk_m_hash);

        if (is_init) {
            storage.links.at(key).initialize(&mut note, broadcast, a_ivpk_m);
        } else {
            assert(storage.links.at(key).get_note(broadcast, a_ivpk_m).value == 0);
            storage.links.at(key).replace(&mut note, broadcast, a_ivpk_m);
        }
    }

    #[aztec(private)]
    fn assert_linked_to(from: AztecAddress, to: AztecAddress) {
        let a_ivpk_m = get_ivpk_m(&mut context, from);
        assert(storage.links.at(LinkKey { from, to }).get_note(true, a_ivpk_m).value == 1);
    }

    unconstrained fn link_exists(from: AztecAddress, to: AztecAddress) -> pub bool {
        storage.links.at(LinkKey { from, to }).is_initialized()
    }

    struct LinkKey {
        from: AztecAddress,
        to: AztecAddress,
    }

    impl ToField for LinkKey {
        fn to_field(self) -> Field {
            pedersen_hash([self.from.to_field(), self.to.to_field()], 0)
        }
    }
}

/*
later in an app

contract Event {
    struct Storage {
        allowed_guests:
    }
    #[aztec(private)]
    fn prove_
}



    // #[aztec(private)]
    // fn prove_path(path: [AztecAddress; MAX_PATH_LEN]) {
    //     for i in 0..MAX_PATH_LEN {
    //         if path[i] != 0 {
    //             assert(storage.links.at(path[i]).at(path[i + 1]).read() == 1);
    //         }
    //     }
    // }


*/
