import { findAreaByZip } from './areas';

describe('findAreaByZip', () => {
  it('finds a served town by ZIP', () => {
    const result = findAreaByZip('80512');
    expect(result.status).toBe('served');
    if (result.status === 'served') expect(result.area.town).toBe('Ridgeline');
  });

  it('ignores surrounding whitespace', () => {
    expect(findAreaByZip(' 80512 ').status).toBe('served');
  });

  it('accepts ZIP+4', () => {
    const result = findAreaByZip('80512-1234');
    expect(result.status === 'served' && result.area.town).toBe('Ridgeline');
  });

  it('reports a valid ZIP outside the area as not served', () => {
    expect(findAreaByZip('99999')).toEqual({ status: 'not-served' });
  });

  it.each(['8051', 'abcde', '', '805123'])('rejects malformed ZIP %j as invalid', (zip) => {
    expect(findAreaByZip(zip)).toEqual({ status: 'invalid' });
  });
});
