const pets = [
  { name: "강아지", src: "/img/dog.png" },
  { name: "고양이", src: "/img/cat.png" },
  { name: "토끼", src: "/img/rabbit.png" },
  { name: "햄스터", src: "/img/hamster.png" },
  { name: "거북이", src: "/img/turtle.png" },
  { name: "새", src: "/img/bird.png" },
];

export default function ImageGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10">
          우리의 반려동물
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={pet.src}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {pet.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
