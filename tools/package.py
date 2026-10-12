from pathlib import Path
import zipfile,hashlib,json,shutil

root=Path(__file__).resolve().parents[1]
deploy=root/'deploy'
assert not deploy.is_symlink() and deploy.resolve().parent==root
files=[root/name for name in ['index.html','404.html','.nojekyll','robots.txt','sitemap.xml','site.webmanifest']]
for folder in ['ar','assets','css','js']:
    files.extend(p for p in (root/folder).rglob('*') if p.is_file() and p.name!='ak-logo.png')
expected={p.relative_to(root).as_posix() for p in files}
if deploy.exists():
    extras=[str(p.relative_to(deploy)) for p in deploy.rglob('*') if p.is_file() and p.relative_to(deploy).as_posix() not in expected]
    if extras: raise RuntimeError('Review unexpected files in deploy before packaging: '+str(extras))
deploy.mkdir(exist_ok=True)
for file in files:
    name=file.relative_to(root)
    assert name.as_posix()==name.as_posix().lower() and name.as_posix().isascii() and ' ' not in str(name)
    target=deploy/name
    assert target.resolve().is_relative_to(deploy.resolve())
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(file,target)
archive=root/'adnan-kafri-deploy.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as out:
    for name in sorted(expected):out.write(deploy/name,name)
with zipfile.ZipFile(archive) as check:
    assert check.testzip() is None and set(check.namelist())==expected
    assert {'index.html','ar/index.html','404.html','.nojekyll'}<=expected
    assert all(not name.startswith(('qa/','tools/','node_modules/','.git/')) for name in expected)
print(json.dumps({'folder':str(deploy),'archive':str(archive),'files':len(files),'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest()},indent=2))
