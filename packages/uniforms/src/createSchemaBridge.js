import invariant from 'fbjs/lib/invariant';

import GraphQLBridge       from './GraphQLBridge';
import SimpleSchemaBridge  from './SimpleSchemaBridge';
import SimpleSchema2Bridge from './SimpleSchema2Bridge';

const bridges = [
    GraphQLBridge,
    SimpleSchemaBridge,
    SimpleSchema2Bridge
];

const isBridge = schema =>
    schema &&
    schema.getError &&
    schema.getErrorMessage &&
    schema.getErrorMessages &&
    schema.getField &&
    schema.getInitialValue &&
    schema.getProps &&
    schema.getSubfields &&
    schema.getType &&
    schema.getValidator
;

export default function createSchemaBridge (schema) {
    // There's no need for an extra wrapper.
    if (isBridge(schema)) {
        return schema;
    }

    const Bridge = bridges.find(bridge => bridge.check(schema));

    invariant(Bridge, 'Unrecognised schema: %s', schema);

    return new Bridge(schema);
}
