// Copas dikit ga ngaruh
const imagekit = require("../tools/imagekit.js")

class PostController {
  // Ini private field
  #model;
  #data;
  #type;

  // Ini constructor
  constructor(model, type) {
    this.#model = model;
    this.#type = type

    // Ambil semua postingan di db, urutin berdasarkan like nya, masukin this.#data
    this.#model.find({}, null, { sort: { like: -1 } }).then(data => this.#data = data);
  }

  // Func buat createPost
  async createPost(req, res) {
    // Ambil semua yg diperlukan dari obj req
    const noteContent = req.body.noteContent
    const noteName = req.body.noteName
    const noteId = this.#data.length + 100;
    const color = req.body.noteColor
    const file = req.file;

    try { 
      // Kalo content ama name nya ga kosong
      if (!noteContent || !noteName || noteContent.trim() === "" || noteName.trim() === "") return res.status(400).json({ msg: "Nama dan postingan tidak boleh kosong" })
      
      // Kalo ada postingan dg content yg sama return
      const existingNote = await this.#model.findOne({ noteContent })
      if (existingNote) return res.status(400).json({ msg: "Postingan sudah ada" })
   
      // Kalo ada file yg dikirim jalanin ini dulu
      if (file && file !== {}) {
        // Masukin ke cdn lah
        await imagekit.upload({
          file: file.buffer.toString("base64"),
          fileName : 'image'+ (this.#type !== "main" ? this.#type : "")+'-'+noteId+'.jpg'
        })
      }

      // Tambahin post baru ke db
      await this.#model.create({ noteContent, noteName, noteId, color, comment: [], like: 0})
      // Ke this.#data juga
      this.#data.unshift({ noteId, noteContent, noteName, like: 0, comment: [], color })
      
      // Kirim emit newPost
      req.io.emit('newPost', this.#type, this.#data[0]);
      
      // return sukses
      res.json({ msg: "Sukses" })

    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Terjadi kesalahan" })
    }
  }

  // Yg ini buat ngambil banyak post makanya namanya getPosts
  getPosts(req, res) {
    // Query itu yg di url setelah tanda tanya (?)
    const search = req.query.search;
    const from = req.query.from;
    const to = req.query.to;

    // Kalo ada query search kita cari postingan berdasarkan query yg dikirim
    if (search) {
      this.#model
        .find({
          $or: [
            {
              noteContent: { $regex: search, $options: "i" },
            },
            {
              noteName: { $regex: search, $options: "i" },
            },
          ],
        })
        .lean()
        .then((posts) => res.json({ posts }))
        .catch((err) => {
          res.status(500).json({ msg: "cannot find post" });
          console.log(err);
        });

    // Kalo adanya query form ama to kita ambil data berdasarkan query tersebut
    } else if (from && to) {
      const posts = this.#data.slice(from, to)
      if(!posts || posts === []) return res.status(404).json({ msg: "postingan tidak ditemukan" })
      res.json({ posts, postTotal: this.#data.length })

    // Kalo ga ya return aja semua
    } else {
      res.json({ posts: this.#data });
    }
  }

  // Yg ini cuman ngambil 1 post berdasarkan id yg dikirim di url
  getPost(req, res) {
    const post = this.#data.find(({ noteId }) => noteId == req.params.id)
    if(!post) return res.status(404).json({ msg: "postingan tidak ditemukan" })
    res.json({ post });
  }

  // Yg ini buat nanganin like
  like(req, res) {
    // Cari postingan yg mau di-like
    const itemIndex = this.#data.findIndex(
      ({ noteId }) => noteId == req.params.id
    );

    // Kalo postingan nya ga ada return
    if (itemIndex == -1) return res.status(404).json({ msg: "post not found" });

    // Cari postingan nya di db habis itu tambah like nya
    this.#model
      .findOneAndUpdate({ noteId: req.params.id }, { $inc: { like: 1 } })
      .then(() => {
        // Ambil postingan dari this.#data, tambah like nya, terus taruh postingan nya di awal this.#data
        const post = this.#data.splice(itemIndex, 1)[0];
        post.like++;
        this.#data.unshift(post);

        // Kirim emit ke client biar real-time terus sendStatus biar berenti lah jir
        req.io.emit("addLike", this.#type, req.params.id)
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ msg: "cannot update database" });
      });
  }

  // Yg ini buat ngepost comment
  comment(req, res) {
    const commentContent = req.body.content;
    const commenterName = req.body.name;
    const noteIdPost = parseInt(req.params.id.trim());
    const commentId = this.#data.length + 50;

    // Kalo nama atau content nya ada yang kosong return
    if (!commentContent || !commenterName || commentContent.trim() === "" || commenterName.trim() === "")
      return res
        .status(400)
        .json({ msg: "nama dan content tidak boleh kosong" });

    // Cari postingan yg mau ditambah comment
    const itemIndex = this.#data.findIndex(
      ({ noteId }) => noteId == noteIdPost
    );

    // Kalo postingan nya ga ada return
    if (itemIndex == -1) return res.status(404).json({ msg: "post not found" });

    // Jadiin obj dulu biar gampang entar
    const comment = { commentContent, commentId, commenterName }

    // Cari postingan nya di db habis itu push comment nya
    this.#model
      .findOneAndUpdate(
        { noteId: noteIdPost },
        {
          $push: { comment },
        }
      )
      .then(() => {
        // Ambil postingan dari this.#data, masukin comment nya, terus taruh postingan nya di awal this.#data
        const post = this.#data.splice(itemIndex, 1)[0];
        post.comment.push(comment);
        this.#data.unshift(post);

        // Kirim emit ke client biar real-time terus sendStatus biar berenti lah jir
        req.io.emit("newComment", this.#type, noteIdPost, comment)
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ msg: "cannot update database" });
      });
  }
}

// Terakhir export class ny
module.exports = PostController;
