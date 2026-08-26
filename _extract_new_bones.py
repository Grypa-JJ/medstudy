import zipfile, json, os

z = zipfile.ZipFile('_atlas_pilot/bodyparts3d_99.zip')
names = z.namelist()
# mapa: real FMA/BP id -> pelna nazwa wewnatrz zipa (separator moze byc / albo \)
name_by_id = {}
for n in names:
    base = n.replace('\\', '/').split('/')[-1]
    if base.endswith('.obj'):
        name_by_id[base[:-4]] = n

bones = json.load(open('_atlas_pilot/newly_labeled_bones.json', encoding='utf-8'))
os.makedirs('r2_upload/atlas/szkielet', exist_ok=True)

extracted = 0
missing = []
for b in bones:
    zn = name_by_id.get(b['id'])
    if not zn:
        missing.append(b['id'])
        continue
    data = z.read(zn)
    open(f"r2_upload/atlas/szkielet/{b['id']}.obj", 'wb').write(data)
    extracted += 1

print('wyciagnieto', extracted, '/', len(bones))
if missing:
    print('BRAK w zipie:', missing)
