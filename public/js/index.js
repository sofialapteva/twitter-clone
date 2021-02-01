const client = filestack.init('AEU1BtQQVQBOOVeFKP4XZz');
//создание нового поста или редактирование поста с изменением картинки
document.querySelector('#picture').addEventListener('change', (event) => {
  console.log('1')
  const file = event.target.files[0];
  const token = {};

  document.forms.newPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const twit = document.forms.newPostForm.twit.value;
    const createdAt = document.forms.newPostForm.createdAt?.value;
    const likes = document.forms.newPostForm.likes?.value;

    client.upload(file, {}, {}, token)
      .then(async (res) => {
        await fetch('/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            img: res.url,
            twit: twit,
            createdAt: createdAt,
            likes: likes,
          })
        });
        if (createdAt) {
          await fetch(`/${newPostForm.dataset.delete}`, {
            method: 'DELETE'
          });
        }
        location.href = '/'
      })
      .catch(err => {
        console.log(err)
      });
  })
});
//ставим крайки
document.querySelectorAll('.like').forEach(el => {
  el.addEventListener('click', async (e) => {
    e.preventDefault();
    const req = await fetch(`/${el.dataset.like}`)
    const likes = await req.json()
    document.querySelectorAll('.like-amount')[[...document.querySelectorAll('.like')].indexOf(el)].innerHTML = likes.likes
  })
})

document.querySelectorAll('.delete').forEach(el => {
  el.addEventListener('click', async (e) => {
    e.preventDefault();
    let confirmation = confirm('Вы уверены, что хотите удалить пост?')
    if (confirmation) {
      await fetch(`/${el.dataset.delete}`, {
        method: 'DELETE'
      })
      document.getElementById(`${el.dataset.delete}`).setAttribute('style', 'display:none')
    }
  })
})
