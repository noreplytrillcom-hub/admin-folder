import styles from "./Skeleton.module.css";

/**
 * Universal Skeleton Loader Component
 *
 * @param {string} variant - 'text' | 'circle' | 'rect' | 'form' | 'dashboard' | 'card' | 'table'
 * @param {string|number} width - Custom width (e.g., '100%', '150px')
 * @param {string|number} height - Custom height (e.g., '20px', '200px')
 * @param {number} count - Repeat count for lines/items (default: 1)
 * @param {string} borderRadius - Custom border radius (e.g., '50%', '12px')
 */
export default function SkeletonLoader({
  variant = "text",
  width,
  height,
  count = 1,
  borderRadius,
  className = "",
  style = {},
}) {
  const customStyles = {
    ...(width && { width }),
    ...(height && { height }),
    ...(borderRadius && { borderRadius }),
    ...style,
  };

  // Helper for rendering multiple primitive skeletons
  const renderPrimitives = (defaultHeight = "20px", defaultWidth = "100%") => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${className}`}
          style={{
            height: height || defaultHeight,
            width: width || defaultWidth,
            ...(borderRadius && { borderRadius }),
            ...style,
          }}
        />
      ))}
    </>
  );

  // 1. Base Variants (Primitives)
  if (variant === "text") return renderPrimitives("16px", "100%");
  if (variant === "circle") return renderPrimitives("50px", "50px");
  if (variant === "rect") return renderPrimitives("100px", "100%");

  // 2. Complex Page Layout Presets
  if (variant === "form") {
    return (
      <div className={styles.container}>
        {/* Page Title */}
        <div
          className={styles.skeleton}
          style={{ width: "180px", height: "28px" }}
        />

        <div className={styles.card}>
          {/* Avatar / Top Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              className={styles.skeleton}
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <div
              className={styles.skeleton}
              style={{ width: "120px", height: "14px" }}
            />
          </div>

          {/* Form Fields */}
          <div className={styles.formGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  className={styles.skeleton}
                  style={{ width: "70px", height: "14px" }}
                />
                <div
                  className={styles.skeleton}
                  style={{ width: "100%", height: "40px", borderRadius: "8px" }}
                />
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "12px",
            }}
          >
            <div
              className={styles.skeleton}
              style={{ width: "100px", height: "40px", borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={styles.container}>
        {/* Stats Grid */}
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <div
                className={styles.skeleton}
                style={{ width: "40%", height: "16px" }}
              />
              <div
                className={styles.skeleton}
                style={{ width: "60%", height: "32px" }}
              />
            </div>
          ))}
        </div>
        {/* Main Content Area */}
        <div
          className={styles.skeleton}
          style={{ width: "100%", height: "300px", borderRadius: "12px" }}
        />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={styles.container}>
        {Array.from({ length: count || 5 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div
              className={styles.skeleton}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <div
              className={styles.skeleton}
              style={{ flex: 1, height: "20px" }}
            />
            <div
              className={styles.skeleton}
              style={{ width: "100px", height: "20px" }}
            />
            <div
              className={styles.skeleton}
              style={{ width: "80px", height: "20px" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={styles.card}>
        <div
          className={styles.skeleton}
          style={{ width: "100%", height: "160px", borderRadius: "8px" }}
        />
        <div
          className={styles.skeleton}
          style={{ width: "70%", height: "20px" }}
        />
        <div
          className={styles.skeleton}
          style={{ width: "100%", height: "14px" }}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.skeleton} ${className}`} style={customStyles} />
  );
}
