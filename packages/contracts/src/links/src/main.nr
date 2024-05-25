contract Links {
    use dep::aztec::prelude::{AztecAddress, PrivateImmutable, PrivateMutable, PublicMutable, Map, PrivateSet, NoteHeader, PrivateContext};
    use dep::aztec::protocol_types::{hash::pedersen_hash, traits::ToField};
    use dep::easy_private_state::EasyPrivateUint;
    use dep::value_note::value_note::ValueNote;
    use dep::aztec::{hash::compute_secret_hash, note::note_getter_options::NoteGetterOptions};
    use dep::authwit::auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public};
    use dep::aztec::keys::getters::{get_npk_m_hash, get_ivpk_m};

    global MAX_PATH_LEN = 5;

    #[aztec(storage)]
    struct Storage {
        links: Map<LinkKey, PrivateMutable<ValueNote>>,

        // proofs: Map<Field, MyStruct>
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor() {}

    #[aztec(private)]
    fn add_link(a: AztecAddress, b: AztecAddress) {
        assert(context.msg_sender() == a);

        let a_npk_m_hash = get_npk_m_hash(&mut context, a);
        let key = LinkKey { a, b };
        let a_ivpk_m = get_ivpk_m(&mut context, a);
        assert(storage.links.at(key).get_note(false, a_ivpk_m).value == 0);
        storage.links.at(key).replace(&mut ValueNote::new(1, a_npk_m_hash), false, a_ivpk_m);
    }

    #[aztec(private)]
    fn assert_linked_to(me: AztecAddress, you: AztecAddress) {
        let a_ivpk_m = get_ivpk_m(&mut context, me);
        assert(storage.links.at(LinkKey { a: me, b: you }).get_note(false, a_ivpk_m).value == 1);
    }

    struct LinkKey {
        a: AztecAddress,
        b: AztecAddress,
    }

    impl ToField for LinkKey {
        fn to_field(self) -> Field {
            pedersen_hash([self.a.to_field(), self.b.to_field()], 0)
        }
    }

    fn hash_pending_shield_data(token_id: Field, amount: Field) -> pub Field {
        pedersen_hash([token_id, amount], 0)
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
