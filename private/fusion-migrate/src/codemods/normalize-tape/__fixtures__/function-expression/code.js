import test from 'tape';

test('a', t => 
  something()
    .then(() => t.end())
    .catch(() => t.end())
)