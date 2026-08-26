import zipfile, json
z = zipfile.ZipFile('_atlas_pilot/bodyparts3d_99.zip')
names = set(z.namelist())
mesh_ids = set()
for n in names:
    base = n.replace('\\', '/').split('/')[-1]
    if base.endswith('.obj'):
        mesh_ids.add(base[:-4])
print('total realnych siatek w zipie:', len(mesh_ids))
json.dump(sorted(mesh_ids), open('_atlas_pilot/real_mesh_ids.json', 'w'))
