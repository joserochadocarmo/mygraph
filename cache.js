import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 10, checkperiod: 90 } );

export default myCache;
