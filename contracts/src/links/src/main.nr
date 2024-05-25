contract Links {
    use dep::aztec::prelude::{AztecAddress, NoteHeader, PrivateContext, PublicMutable, SharedImmutable, FunctionSelector, Map, PrivateSet};
    use dep::easy_private_state::EasyPrivateUint;
    // use dep::value_note::{ValueNote, balance_utils};
    use dep::aztec::{hash::compute_secret_hash, note::{note_getter_options::NoteGetterOptions}};
    use dep::authwit::{auth::{assert_current_call_valid_authwit, assert_current_call_valid_authwit_public}};

    global MAX_PATH_LEN = 5;

    #[aztec(storage)]
    struct Storage {
        // links: Map<AztecAddress, Map<AztecAddress, ValueNote>>,
        mock: Map<AztecAddress, PublicMutable<AztecAddress>>, // TODO: remove this

        // proofs: Map<Field, MyStruct>
    }

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor() {}

    #[aztec(private)]
    fn add_link(a: AztecAddress, b: AztecAddress) {
        // assert msg.sender == a
        // storage.links.at(a).at(b).set(1);
        // storage.links.at(b).at(a).set(1);
    }

    #[aztec(private)]
    fn prove_link(me: AztecAddress, you: AztecAddress) {
        assert(context.msg_sender() == me);
        // assert(storage.links.at(me).at(you).read() == 1);
    }

    // c.prove_link(b, c)
    // b.prove_link(a, b)

    // a.verify(a, c)

    #[aztec(private)]
    fn verify(a: AztecAddress, c: AztecAddress) {}
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
